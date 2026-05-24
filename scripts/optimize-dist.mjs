import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transformSync } from 'esbuild';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const dsStoreDirs = ['public', 'src', 'dist'];

const stats = {
  dsStoreRemoved: 0,
  htmlFiles: 0,
  inlineScripts: 0,
  inlineScriptsMinified: 0,
  inlineScriptsSkipped: 0,
  htmlBytesBefore: 0,
  htmlBytesAfter: 0,
};

const pathExists = async (filePath) => {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
};

const walk = async (dir, visitor) => {
  if (!(await pathExists(dir))) return;

  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath, visitor);
        return;
      }
      if (entry.isFile()) await visitor(entryPath);
    }),
  );
};

const removeFile = async (filePath) => {
  try {
    await rm(filePath);
    stats.dsStoreRemoved += 1;
  } catch {
    // Ignore cleanup failures for files that can be recreated by the OS.
  }
};

const removeDsStoreFiles = async () => {
  await removeFile(path.join(rootDir, '.DS_Store'));

  await Promise.all(
    dsStoreDirs.map(async (dir) => {
      await walk(path.join(rootDir, dir), async (filePath) => {
        if (path.basename(filePath) === '.DS_Store') await removeFile(filePath);
      });
    }),
  );
};

const inlineScriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

const isInlineJavaScript = (attrs) => {
  if (/\bsrc\s*=/.test(attrs)) return false;

  const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
  return (
    !type ||
    type === 'module' ||
    type === 'text/javascript' ||
    type === 'application/javascript' ||
    type === 'text/ecmascript' ||
    type === 'application/ecmascript'
  );
};

const minifyInlineScript = (code) => {
  stats.inlineScripts += 1;

  if (!code.trim()) return code;

  try {
    const minified = transformSync(code, {
      loader: 'js',
      minify: true,
      legalComments: 'none',
    })
      .code.trim()
      .replace(/<\/script/gi, '<\\/script');

    if (!minified || Buffer.byteLength(minified) >= Buffer.byteLength(code)) return code;

    stats.inlineScriptsMinified += 1;
    return minified;
  } catch {
    stats.inlineScriptsSkipped += 1;
    return code;
  }
};

const optimizeHtml = (html) =>
  html
    .replace(/<meta name="generator" content="[^"]*"\/?>/g, '')
    .replace(inlineScriptPattern, (match, attrs, code) => {
      if (!isInlineJavaScript(attrs)) return match;
      return `<script${attrs}>${minifyInlineScript(code)}</script>`;
    });

const optimizeHtmlFiles = async () => {
  await walk(distDir, async (filePath) => {
    if (!filePath.endsWith('.html')) return;

    const html = await readFile(filePath, 'utf8');
    const optimized = optimizeHtml(html);

    stats.htmlFiles += 1;
    stats.htmlBytesBefore += Buffer.byteLength(html);
    stats.htmlBytesAfter += Buffer.byteLength(optimized);

    if (optimized !== html) await writeFile(filePath, optimized);
  });
};

await removeDsStoreFiles();
await optimizeHtmlFiles();

const saved = stats.htmlBytesBefore - stats.htmlBytesAfter;
console.log(
  [
    `Optimized ${stats.htmlFiles} HTML files`,
    `removed ${stats.dsStoreRemoved} .DS_Store files`,
    `minified ${stats.inlineScriptsMinified}/${stats.inlineScripts} inline scripts`,
    stats.inlineScriptsSkipped > 0 ? `skipped ${stats.inlineScriptsSkipped} inline scripts` : null,
    `saved ${(saved / 1024).toFixed(1)} KiB raw HTML`,
  ]
    .filter(Boolean)
    .join(', '),
);
