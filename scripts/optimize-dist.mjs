import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transformSync } from 'esbuild';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const astroDir = path.join(distDir, '_astro');
const dsStoreDirs = ['public', 'src', 'dist'];
const sharedInlinePrefix = 'shared-inline.';
const lazyLoaderPrefix = 'lazy-';
const minExtractBytes = 120;
const minExtractDuplicateBytes = 8 * 1024;

const stats = {
  dsStoreRemoved: 0,
  sharedInlineFilesRemoved: 0,
  sharedInlineFiles: 0,
  sharedInlineBytes: 0,
  lazyLoaderFilesRemoved: 0,
  lazyLoaderFiles: 0,
  lazyLoaderBytes: 0,
  lazyScriptTagsReplaced: 0,
  lazyOriginalScriptBytes: 0,
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

const removeGeneratedLazyLoaderFiles = async () => {
  if (!(await pathExists(astroDir))) return;

  const entries = await readdir(astroDir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isFile() || !entry.name.startsWith(lazyLoaderPrefix) || !entry.name.endsWith('.js')) {
        return;
      }

      await rm(path.join(astroDir, entry.name));
      stats.lazyLoaderFilesRemoved += 1;
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

const scriptTagPattern = /<script\b([^>]*)\bsrc=(["'])([^"']+)\2([^>]*)><\/script>/gi;

const lazyScriptKind = (src) => {
  const fileName = src.split('/').pop() ?? '';

  if (fileName.startsWith('Search.astro_')) return 'search';
  if (fileName.startsWith('ImageZoom.astro_')) return 'image-zoom';
  if (/^ec\.[^.]+\.js$/.test(fileName)) return 'expressive-code';

  return null;
};

const generatedLoaderCode = (kind, source) => {
  switch (kind) {
    case 'search':
      return `
const source=${JSON.stringify(source)};
let loading;
const getButton=()=>document.querySelector("site-search button[data-open-modal]");
const enableButton=()=>{const button=getButton();if(button)button.disabled=false};
const load=()=>loading??=import(source).then(async module=>{await customElements.whenDefined("site-search");return module});
const open=event=>{event?.preventDefault();event?.stopImmediatePropagation();load().then(()=>requestAnimationFrame(()=>getButton()?.click()))};
const warm=event=>{if(event.target instanceof Element&&event.target.closest("site-search"))load()};
const click=event=>{if(customElements.get("site-search"))return;if(event.target instanceof Element&&event.target.closest("site-search button[data-open-modal]"))open(event)};
const key=event=>{if(customElements.get("site-search"))return;if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k")open(event)};
document.addEventListener("click",click,true);
document.addEventListener("keydown",key,true);
document.addEventListener("pointerover",warm,{capture:true,passive:true});
document.addEventListener("focusin",warm,true);
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",enableButton,{once:true}):enableButton();
`;
    case 'image-zoom':
      return `
const source=${JSON.stringify(source)};
const selector="starlight-image-zoom-zoomable";
let loading;
let observer;
const click=event=>{if(customElements.get("starlight-image-zoom"))return;const target=event.target;if(!(target instanceof Element)||!target.closest(selector))return;event.preventDefault();event.stopImmediatePropagation();load().then(()=>requestAnimationFrame(()=>target.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}))))};
const warm=event=>{if(event.target instanceof Element&&event.target.closest(selector))load()};
const cleanup=()=>{observer?.disconnect();document.removeEventListener("click",click,true);document.removeEventListener("pointerover",warm,true);document.removeEventListener("focusin",warm,true)};
const afterIdle=()=>new Promise(resolve=>(globalThis.requestIdleCallback??(callback=>setTimeout(callback,1)))(resolve));
const load=()=>loading??=import(source).then(async module=>{await afterIdle();cleanup();return module});
const setup=()=>{const targets=[...document.querySelectorAll(selector)];if(targets.length===0)return;document.addEventListener("click",click,true);document.addEventListener("pointerover",warm,{capture:true,passive:true});document.addEventListener("focusin",warm,true);if("IntersectionObserver"in window){observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))load()},{rootMargin:"900px 0px"});targets.forEach(target=>observer.observe(target))}else load()};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",setup,{once:true}):setup();
`;
    case 'expressive-code':
      return `
const source=${JSON.stringify(source)};
const selector=".expressive-code";
let loading;
let loaded=false;
let observer;
const cleanup=()=>{observer?.disconnect();document.removeEventListener("click",click,true);document.removeEventListener("pointerover",warm,true);document.removeEventListener("focusin",warm,true)};
const load=()=>loading??=import(source).then(module=>{loaded=true;cleanup();return module});
const click=event=>{if(loaded)return;const target=event.target;if(!(target instanceof Element))return;const button=target.closest(".expressive-code .copy button");if(!button)return;event.preventDefault();event.stopImmediatePropagation();load().then(()=>requestAnimationFrame(()=>button.click()))};
const warm=event=>{if(!loaded&&event.target instanceof Element&&event.target.closest(selector))load()};
const setup=()=>{const targets=[...document.querySelectorAll(selector)];if(targets.length===0)return;document.addEventListener("click",click,true);document.addEventListener("pointerover",warm,{capture:true,passive:true});document.addEventListener("focusin",warm,true);if("IntersectionObserver"in window){observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))load()},{rootMargin:"700px 0px"});targets.forEach(target=>observer.observe(target))}else load()};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",setup,{once:true}):setup();
`;
    default:
      throw new Error(`Unknown lazy script kind: ${kind}`);
  }
};

const minifyGeneratedJavaScript = (code) =>
  transformSync(code, {
    loader: 'js',
    minify: true,
    legalComments: 'none',
  }).code.trim();

const lazyLoaderFileName = (kind, source, code) => {
  const hash = createHash('sha256')
    .update(kind)
    .update('\0')
    .update(source)
    .update('\0')
    .update(code)
    .digest('hex')
    .slice(0, 10);

  return `${lazyLoaderPrefix}${kind}.${hash}.js`;
};

const collectLazyScripts = (htmlFiles) => {
  const scripts = new Map();

  for (const { html } of htmlFiles) {
    html.replace(scriptTagPattern, (match, _beforeSrc, _quote, src, _afterSrc) => {
      const kind = lazyScriptKind(src);
      if (!kind) return match;

      const script = scripts.get(src) ?? {
        kind,
        src,
        occurrences: 0,
      };
      script.occurrences += 1;
      scripts.set(src, script);

      return match;
    });
  }

  return [...scripts.values()];
};

const patchLateLoadedScript = async (script) => {
  const fileName = script.src.split('/').pop();
  if (!fileName) return;

  const filePath = path.join(astroDir, fileName);
  if (!(await pathExists(filePath))) {
    throw new Error(`Unable to find lazy-loaded ${script.kind} script: ${fileName}`);
  }

  const code = await readFile(filePath, 'utf8');
  let patched = code;

  const replaceRequired = (from, to, label) => {
    if (!patched.includes(from)) {
      throw new Error(`Unable to patch late-loaded ${script.kind} script (${label}): ${fileName}`);
    }

    patched = patched.replace(from, to);
  };

  if (script.kind === 'search') {
    replaceRequired(
      'window.addEventListener("DOMContentLoaded",()=>{(window.requestIdleCallback',
      'const I=()=>{(window.requestIdleCallback',
      'search init start',
    );
    replaceRequired(
      '})})}}customElements.define("site-search",b);',
      '})};document.readyState==="loading"?window.addEventListener("DOMContentLoaded",I,{once:!0}):I()}}customElements.define("site-search",b);',
      'search init end',
    );
  }

  if (script.kind === 'image-zoom') {
    replaceRequired(
      'globalThis.addEventListener("DOMContentLoaded",e,{once:!0}),document.addEventListener("astro:after-preparation"',
      'document.readyState==="loading"?globalThis.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("astro:after-preparation"',
      'image zoom init',
    );
  }

  if (patched !== code) await writeFile(filePath, patched);
};

const patchLateLoadedScripts = async (scripts) => {
  await Promise.all(scripts.map((script) => patchLateLoadedScript(script)));
};

const writeLazyLoaders = async (scripts, assetPublicPath) => {
  if (scripts.length === 0) return new Map();

  await mkdir(astroDir, { recursive: true });

  const sources = new Map();
  for (const script of scripts.sort((a, b) => a.src.localeCompare(b.src))) {
    const code = `${minifyGeneratedJavaScript(generatedLoaderCode(script.kind, script.src))}\n`;
    const fileName = lazyLoaderFileName(script.kind, script.src, code);

    await writeFile(path.join(astroDir, fileName), code);
    sources.set(script.src, {
      kind: script.kind,
      occurrences: script.occurrences,
      src: `${assetPublicPath}${fileName}`,
    });

    stats.lazyLoaderFiles += 1;
    stats.lazyLoaderBytes += Buffer.byteLength(code);
    stats.lazyScriptTagsReplaced += script.occurrences;

    const originalPath = path.join(astroDir, script.src.split('/').pop() ?? '');
    if (await pathExists(originalPath)) {
      const originalStat = await stat(originalPath);
      stats.lazyOriginalScriptBytes += originalStat.size;
    }
  }

  return sources;
};

const replaceLazyScripts = (html, sources) =>
  html.replace(scriptTagPattern, (match, _beforeSrc, _quote, src) => {
    const loader = sources.get(src);
    if (!loader) return match;

    return `<script type="module" src="${loader.src}"></script>`;
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

  const htmlFilesWithSharedScripts = htmlFiles.map((file) => ({
    ...file,
    html: extractSharedInlineScripts(file.html, sharedInlineSources),
  }));

  const lazyScripts = collectLazyScripts(htmlFilesWithSharedScripts);
  await patchLateLoadedScripts(lazyScripts);
  if (lazyScripts.length > 0) await removeGeneratedLazyLoaderFiles();
  const lazyLoaderSources = await writeLazyLoaders(lazyScripts, assetPublicPath);

  await Promise.all(
    htmlFilesWithSharedScripts.map(async (file) => {
      const optimized = replaceLazyScripts(file.html, lazyLoaderSources);

      stats.htmlBytesAfter += Buffer.byteLength(optimized);
      if (optimized !== file.original) await writeFile(file.filePath, optimized);
    }),
  );
};

await removeDsStoreFiles();
await optimizeHtmlFiles();

const htmlSaved = stats.htmlBytesBefore - stats.htmlBytesAfter;
const generatedJsBytes = stats.sharedInlineBytes + stats.lazyLoaderBytes;
const netSaved = htmlSaved - generatedJsBytes;
console.log(
  [
    `Optimized ${stats.htmlFiles} HTML files`,
    `removed ${stats.dsStoreRemoved} .DS_Store files`,
    stats.sharedInlineFilesRemoved > 0
      ? `removed ${stats.sharedInlineFilesRemoved} stale shared inline scripts`
      : null,
    stats.lazyLoaderFilesRemoved > 0 ? `removed ${stats.lazyLoaderFilesRemoved} stale lazy loaders` : null,
    `minified ${stats.inlineScriptsMinified}/${stats.inlineScripts} inline scripts`,
    stats.inlineScriptsExtracted > 0
      ? `extracted ${stats.inlineScriptOccurrencesExtracted} shared inline script occurrences into ${stats.sharedInlineFiles} files`
      : null,
    stats.lazyLoaderFiles > 0
      ? `lazy-loaded ${stats.lazyScriptTagsReplaced} script tags through ${stats.lazyLoaderFiles} loaders`
      : null,
    stats.inlineScriptsSkipped > 0 ? `skipped ${stats.inlineScriptsSkipped} inline scripts` : null,
    stats.sharedInlineBytes > 0 ? `wrote ${(stats.sharedInlineBytes / 1024).toFixed(1)} KiB shared JS` : null,
    stats.lazyLoaderBytes > 0
      ? `wrote ${(stats.lazyLoaderBytes / 1024).toFixed(1)} KiB lazy loaders for ${(stats.lazyOriginalScriptBytes / 1024).toFixed(1)} KiB direct JS`
      : null,
    `saved ${(htmlSaved / 1024).toFixed(1)} KiB raw HTML`,
    generatedJsBytes > 0 ? `${(netSaved / 1024).toFixed(1)} KiB net before compression` : null,
  ]
    .filter(Boolean)
    .join(', '),
);
