#!/usr/bin/env node
/**
 * Gera src/data/content/meta.ts a partir dos arquivos de skill individuais.
 * Rodar após qualquer enriquecimento: node scripts/generate-meta.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'data', 'content');
const OUT  = path.join(BASE, 'meta.ts');

const DOMAINS = ['frontend', 'backend', 'database', 'cloud', 'devops', 'ai', 'arch', 'cs', 'obs', 'sec', 'soft'];

function audit(content) {
  const start = content.indexOf(': SkillContent = {');
  const chunk = start >= 0 ? content.slice(start) : content;
  const qaCount     = (chunk.match(/\bq\s*:/g) || []).length;
  const diagrams    = (chunk.match(/\bhtml\s*:/g) || []).length;
  const mnemonics   = (chunk.match(/\btrick\s*:/g) || []).length;
  const hasCheatsheet = /\bcheatsheet\s*:/.test(chunk);
  const hasMindmap    = /\bmindmap\s*:/.test(chunk);
  const exercises   = (chunk.match(/\blevel\s*:\s*['"](iniciante|intermediario|senior)/g) || []).length;
  const videos      = (chunk.match(/\bchannel\s*:/g) || []).length;
  const resources   = (chunk.match(/\bkind\s*:/g) || []).length;
  const codeExamples = (chunk.match(/\blanguage\s*:/g) || []).length;

  let score = 0;
  if (qaCount >= 20)   score++;
  if (qaCount >= 10)   score++;
  if (diagrams >= 3)   score++;
  if (mnemonics >= 3)  score++;
  if (hasCheatsheet)   score++;
  if (hasMindmap)      score++;
  if (exercises >= 3)  score++;
  if (videos >= 4)     score++;
  if (resources >= 5)  score++;
  if (codeExamples >= 3) score++;

  return { qaCount, diagrams, mnemonics, hasCheatsheet, hasMindmap, exercises, videos, resources, codeExamples, score };
}

/**
 * Converte um slug em PascalCase para compor nomes de arquivo de visuais/PDFs.
 * Ex: 'react' → 'React', 'next-js' → 'NextJs', 'node-js' → 'NodeJs'
 */
function slugToPascal(slug) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const entries = [];

for (const domain of DOMAINS) {
  const dir = path.join(BASE, domain);
  const items = fs.readdirSync(dir).sort();

  // Skills flat: arquivos .ts no diretório do domínio (exceto index.ts)
  const flatFiles = items.filter(f => f !== 'index.ts' && f.endsWith('.ts'));

  // Skills em pasta: subdiretórios que contêm um {slug}/{slug}.ts
  const subDirs = items.filter(f => {
    const fullPath = path.join(dir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  // Processar skills flat
  for (const file of flatFiles) {
    const slug      = file.replace(/\.ts$/, '');
    const relFile   = `${domain}/${slug}`;
    const skillDir  = dir;
    const skillPath = path.join(dir, file);
    const content   = fs.readFileSync(skillPath, 'utf8');
    const sizeKb    = Math.round(fs.statSync(skillPath).size / 1024);
    const metrics   = audit(content);
    const pascal    = slugToPascal(slug);
    const hasVisuais = fs.existsSync(path.join(skillDir, `${pascal}Visuais.tsx`));
    const hasPdfs    = fs.existsSync(path.join(skillDir, `${pascal}Pdfs.tsx`));
    entries.push({ slug, domain, file: relFile, sizeKb, hasVisuais, hasPdfs, ...metrics });
  }

  // Processar skills em pasta ({slug}/{slug}.ts)
  for (const subDir of subDirs) {
    const slug      = subDir;
    const skillDir  = path.join(dir, subDir);
    const skillPath = path.join(skillDir, `${slug}.ts`);
    if (!fs.existsSync(skillPath)) continue; // pasta sem skill principal — ignorar
    const relFile   = `${domain}/${slug}`;
    const content   = fs.readFileSync(skillPath, 'utf8');
    const sizeKb    = Math.round(fs.statSync(skillPath).size / 1024);
    const metrics   = audit(content);
    const pascal    = slugToPascal(slug);
    const hasVisuais = fs.existsSync(path.join(skillDir, `${pascal}Visuais.tsx`));
    const hasPdfs    = fs.existsSync(path.join(skillDir, `${pascal}Pdfs.tsx`));
    entries.push({ slug, domain, file: relFile, sizeKb, hasVisuais, hasPdfs, ...metrics });
  }
}

// Build TypeScript source
const lines = [
  `// AUTO-GENERATED — não editar manualmente.`,
  `// Rodar: node scripts/generate-meta.js`,
  ``,
  `export interface SkillMeta {`,
  `  domain: string`,
  `  file: string`,
  `  sizeKb: number`,
  `  score: number       // 0-10 (10 = totalmente enriquecido)`,
  `  qaCount: number`,
  `  diagrams: number`,
  `  mnemonics: number`,
  `  hasCheatsheet: boolean`,
  `  hasMindmap: boolean`,
  `  exercises: number`,
  `  videos: number`,
  `  resources: number`,
  `  codeExamples: number`,
  `  hasVisuais: boolean`,
  `  hasPdfs: boolean`,
  `}`,
  ``,
  `export const SKILL_META: Record<string, SkillMeta> = {`,
];

for (const e of entries) {
  lines.push(
    `  '${e.slug}': { domain: '${e.domain}', file: '${e.file}', sizeKb: ${e.sizeKb}, score: ${e.score}, qaCount: ${e.qaCount}, diagrams: ${e.diagrams}, mnemonics: ${e.mnemonics}, hasCheatsheet: ${e.hasCheatsheet}, hasMindmap: ${e.hasMindmap}, exercises: ${e.exercises}, videos: ${e.videos}, resources: ${e.resources}, codeExamples: ${e.codeExamples}, hasVisuais: ${e.hasVisuais}, hasPdfs: ${e.hasPdfs} },`
  );
}

lines.push(`}`);
lines.push(``);
lines.push(`export function getSkillMeta(slug: string): SkillMeta | null {`);
lines.push(`  return SKILL_META[slug] ?? null`);
lines.push(`}`);
lines.push(``);
lines.push(`export function getSkillsByScore(maxScore: number): string[] {`);
lines.push(`  return Object.entries(SKILL_META)`);
lines.push(`    .filter(([, m]) => m.score <= maxScore)`);
lines.push(`    .sort(([, a], [, b]) => a.score - b.score)`);
lines.push(`    .map(([slug]) => slug)`);
lines.push(`}`);
lines.push(``);

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');

// Print summary
const total   = entries.length;
const perfect = entries.filter(e => e.score === 10).length;
const empty   = entries.filter(e => e.score === 0).length;
const gaps    = entries.filter(e => e.score > 0 && e.score < 10);

console.log(`✓ meta.ts gerado: ${total} skills`);
console.log(`  10/10: ${perfect} | 0/10: ${empty} | parciais: ${gaps.length}`);
console.log(`  Gaps por prioridade:`);
gaps.sort((a, b) => b.score - a.score).slice(0, 10).forEach(e => {
  console.log(`    ${e.score}/10  ${e.slug}  (${e.domain})`);
});
