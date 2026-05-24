import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://wsafight.github.io/business-util';
const docsDir = path.join(process.cwd(), 'src/content/docs');

const header = `# 实用工具

本来想记录业务类型的算法，但业务上大部分问题都和算法无关。

所以本库修改由记录实用工具。

记录的工具源自于工作，生活，开源软件，算法网站，以及他人书籍。

当前网址为: ${siteUrl}/
`;

const errors = [];

const fail = (message) => {
  errors.push(message);
};

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const walkMarkdown = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walkMarkdown(entryPath);
      if (entry.isFile() && entry.name.endsWith('.md')) return [entryPath];
      return [];
    }),
  );

  return files.flat();
};

const parseFrontmatter = (content) => {
  if (!content.startsWith('---\n')) return {};
  const end = content.indexOf('\n---', 4);
  if (end === -1) return {};

  return Object.fromEntries(
    content
      .slice(4, end)
      .split('\n')
      .map((line) => line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]),
  );
};

const slugFromFile = (filePath) =>
  path.relative(docsDir, filePath).replace(/\\/g, '/').replace(/\.md$/, '');

const expectedReadme = (sidebar) => {
  const content = [header];

  for (const item of sidebar) {
    content.push(`* ${item.label}`);
    for (const subItem of item.items) {
      content.push(`    * [${subItem.label}](${siteUrl}/${subItem.slug})`);
    }
    content.push('');
  }

  return content.join('\n');
};

const main = async () => {
  const sidebar = await readJson('sidebar.json');
  const sidebarEntries = sidebar.flatMap((group) => group.items ?? []);
  const sidebarSlugs = new Set();

  for (const entry of sidebarEntries) {
    if (sidebarSlugs.has(entry.slug)) {
      fail(`Duplicate sidebar slug: ${entry.slug}`);
    }
    sidebarSlugs.add(entry.slug);
  }

  const docs = new Map();
  const files = await walkMarkdown(docsDir);

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const slug = slugFromFile(file);
    const title = frontmatter.title;
    const draft = frontmatter.draft === 'true';

    if (!title) {
      fail(`Missing title frontmatter: ${file}`);
    }

    docs.set(slug, { file, title, draft });
  }

  for (const slug of sidebarSlugs) {
    const doc = docs.get(slug);
    if (!doc) {
      fail(`Sidebar slug has no markdown file: ${slug}`);
      continue;
    }

    if (doc.draft) {
      fail(`Draft document is listed in sidebar: ${slug}`);
    }
  }

  for (const [slug, doc] of docs) {
    if (!doc.draft && !sidebarSlugs.has(slug)) {
      fail(`Published document is missing from sidebar: ${slug}`);
    }
  }

  const publicTitles = new Map();
  for (const [slug, doc] of docs) {
    if (doc.draft || !doc.title) continue;
    const existing = publicTitles.get(doc.title) ?? [];
    existing.push(slug);
    publicTitles.set(doc.title, existing);
  }

  for (const [title, slugs] of publicTitles) {
    if (slugs.length > 1) {
      fail(`Duplicate published title "${title}": ${slugs.join(', ')}`);
    }
  }

  if (existsSync('README.md')) {
    const readme = await readFile('README.md', 'utf8');
    const generated = expectedReadme(sidebar);
    if (readme !== generated) {
      fail('README.md is out of sync. Run `bun run gen-readme`.');
    }
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
  }

  console.log(`Content check passed: ${docs.size} docs, ${sidebarSlugs.size} sidebar entries.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
