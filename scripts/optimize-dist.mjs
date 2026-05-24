import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transformSync } from 'esbuild';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const astroDir = path.join(distDir, '_astro');
const dsStoreDirs = ['public', 'src', 'dist'];
const sharedInlinePrefix = 'shared-inline.';
const minExtractBytes = 120;
const minExtractDuplicateBytes = 8 * 1024;

const stats = {
  dsStoreRemoved: 0,
  sharedInlineFilesRemoved: 0,
  sharedInlineFiles: 0,
  sharedInlineBytes: 0,
  htmlFiles: 0,
  inlineScripts: 0,
  inlineScriptsMinified: 0,
  inlineScriptsSkipped: 0,
  inlineScriptsExtracted: 0,
  inlineScriptOccurrencesExtracted: 0,
  htmlBytesBefore: 0,
  htmlBytesAfterMinify: 0,
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

const removeGeneratedSharedInlineFiles = async () => {
  if (!(await pathExists(astroDir))) return;

  const entries = await readdir(astroDir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isFile() || !entry.name.startsWith(sharedInlinePrefix) || !entry.name.endsWith('.js')) {
        return;
      }

      await rm(path.join(astroDir, entry.name));
      stats.sharedInlineFilesRemoved += 1;
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

const getAssetPublicPath = (htmlFiles) => {
  for (const { html } of htmlFiles) {
    const match = html.match(/\b(?:src|href)=["']([^"']*\/_astro\/)[^"']+["']/);
    if (match) return match[1];
  }

  return '/_astro/';
};

const inlineScriptKey = (attrs, code) => `${attrs}\0${code}`;

const isExtractableInlineScript = (attrs, code) => {
  if (!isInlineJavaScript(attrs)) return false;
  if (!code.trim()) return false;

  // Keep the early theme bootstrap inline so the initial color scheme is applied
  // before stylesheets are loaded.
  if (code.includes('window.StarlightThemeProvider=')) return false;

  // Moving security-sensitive or scheduling-related attributes from inline to
  // external scripts can change CSP/runtime behavior.
  if (/\b(?:nonce|integrity|async|defer)\b/i.test(attrs)) return false;

  return true;
};

const collectSharedInlineScripts = (htmlFiles) => {
  const scripts = new Map();

  for (const { filePath, html } of htmlFiles) {
    html.replace(inlineScriptPattern, (match, attrs, code) => {
      if (!isExtractableInlineScript(attrs, code)) return match;

      const key = inlineScriptKey(attrs, code);
      const bytes = Buffer.byteLength(code);
      const script = scripts.get(key) ?? {
        key,
        attrs,
        code,
        bytes,
        occurrences: 0,
        perPage: new Map(),
      };

      script.occurrences += 1;
      script.perPage.set(filePath, (script.perPage.get(filePath) ?? 0) + 1);
      scripts.set(key, script);

      return match;
    });
  }

  return [...scripts.values()].filter((script) => {
    const duplicateBytes = script.bytes * (script.occurrences - 1);
    const maxPerPage = Math.max(...script.perPage.values());

    return (
      script.occurrences > 1 &&
      script.bytes >= minExtractBytes &&
      duplicateBytes >= minExtractDuplicateBytes &&
      maxPerPage === 1
    );
  });
};

const scriptFileName = (script) => {
  const hash = createHash('sha256')
    .update(script.attrs)
    .update('\0')
    .update(script.code)
    .digest('hex')
    .slice(0, 10);

  return `${sharedInlinePrefix}${hash}.js`;
};

const writeSharedInlineScripts = async (scripts, assetPublicPath) => {
  if (scripts.length === 0) return new Map();

  await mkdir(astroDir, { recursive: true });

  const sources = new Map();
  for (const script of scripts.sort((a, b) => scriptFileName(a).localeCompare(scriptFileName(b)))) {
    const fileName = scriptFileName(script);
    const code = script.code.endsWith('\n') ? script.code : `${script.code}\n`;

    await writeFile(path.join(astroDir, fileName), code);
    sources.set(script.key, `${assetPublicPath}${fileName}`);

    stats.sharedInlineFiles += 1;
    stats.sharedInlineBytes += Buffer.byteLength(code);
    stats.inlineScriptsExtracted += 1;
    stats.inlineScriptOccurrencesExtracted += script.occurrences;
  }

  return sources;
};

const extractSharedInlineScripts = (html, sources) =>
  html.replace(inlineScriptPattern, (match, attrs, code) => {
    const src = sources.get(inlineScriptKey(attrs, code));
    if (!src) return match;

    return `<script${attrs} src="${src}"></script>`;
  });

const optimizeHtmlFiles = async () => {
  const htmlFiles = [];

  await walk(distDir, async (filePath) => {
    if (!filePath.endsWith('.html')) return;

    const html = await readFile(filePath, 'utf8');
    const optimized = optimizeHtml(html);

    stats.htmlFiles += 1;
    stats.htmlBytesBefore += Buffer.byteLength(html);
    stats.htmlBytesAfterMinify += Buffer.byteLength(optimized);

    htmlFiles.push({ filePath, original: html, html: optimized });
  });

  htmlFiles.sort((a, b) => a.filePath.localeCompare(b.filePath));

  const assetPublicPath = getAssetPublicPath(htmlFiles);
  const sharedInlineScripts = collectSharedInlineScripts(htmlFiles);
  if (sharedInlineScripts.length > 0) await removeGeneratedSharedInlineFiles();
  const sharedInlineSources = await writeSharedInlineScripts(sharedInlineScripts, assetPublicPath);

  await Promise.all(
    htmlFiles.map(async (file) => {
      const optimized = extractSharedInlineScripts(file.html, sharedInlineSources);

      stats.htmlBytesAfter += Buffer.byteLength(optimized);
      if (optimized !== file.original) await writeFile(file.filePath, optimized);
    }),
  );
};

await removeDsStoreFiles();
await optimizeHtmlFiles();

const htmlSaved = stats.htmlBytesBefore - stats.htmlBytesAfter;
const netSaved = htmlSaved - stats.sharedInlineBytes;
console.log(
  [
    `Optimized ${stats.htmlFiles} HTML files`,
    `removed ${stats.dsStoreRemoved} .DS_Store files`,
    stats.sharedInlineFilesRemoved > 0
      ? `removed ${stats.sharedInlineFilesRemoved} stale shared inline scripts`
      : null,
    `minified ${stats.inlineScriptsMinified}/${stats.inlineScripts} inline scripts`,
    stats.inlineScriptsExtracted > 0
      ? `extracted ${stats.inlineScriptOccurrencesExtracted} shared inline script occurrences into ${stats.sharedInlineFiles} files`
      : null,
    stats.inlineScriptsSkipped > 0 ? `skipped ${stats.inlineScriptsSkipped} inline scripts` : null,
    stats.sharedInlineBytes > 0 ? `wrote ${(stats.sharedInlineBytes / 1024).toFixed(1)} KiB shared JS` : null,
    `saved ${(htmlSaved / 1024).toFixed(1)} KiB raw HTML`,
    stats.sharedInlineBytes > 0 ? `${(netSaved / 1024).toFixed(1)} KiB net before compression` : null,
  ]
    .filter(Boolean)
    .join(', '),
);
