import { test, expect, Page } from '@playwright/test';

const SLUGS = [
  'accessibility-a11y',
  'agentic-workflows',
  'ai-guardrails',
  'algoritmos-ds',
  'anthropic-sdk',
  'apache-kafka',
  'aws',
  'b-tree-lsm-tree',
  'big-o',
  'cap-theorem',
  'chaos-engineering',
  'circuit-breakers',
  'clean-architecture',
  'consistent-hashing',
  'cqrs',
  'crdts',
  'ddd',
  'dependency-injection',
  'design-patterns',
  'design-systems',
  'docker-compose',
  'dynamic-programming',
  'ec2',
  'elasticsearch',
  'event-driven',
  'event-loop',
  'explain-analyze',
  'fine-tuning-lora',
  'github-actions',
  'grafana',
  'hnsw-ivf',
  'http-2-http-3',
  'hugging-face',
  'iam',
  'ingles',
  'jwt',
  'kubernetes',
  'lambda',
  'langgraph',
  'linux',
  'llmops',
  'mcp',
  'memory-management',
  'microservices',
  'mvcc',
  'next-js',
  'node-js',
  'openai-sdk',
  'opentelemetry',
  'owasp-api-top-10',
  'owasp-top-10',
  'playwright',
  'prisma',
  'processos-threads',
  'prometheus',
  'prompt-engineering',
  'qdrant',
  'raft-paxos',
  'rag',
  'ragas',
  'rate-limiting',
  'rds',
  'react-query',
  'redis',
  's3',
  'server-components-rsc',
  'sharding',
  'slis-slos-slas',
  'solid',
  'system-design',
  'tailwind-css',
  'tcp-ip-dns',
  'tdd',
  'terraform',
  'threat-modeling',
  'tls-https',
  'tradeoff-analysis',
  'trpc',
  'vpc',
  'web-vitals',
];

const JS_ERRORS: string[] = [];

async function collectErrors(page: Page) {
  page.on('pageerror', (err) => {
    JS_ERRORS.push(err.message);
  });
}

// Main skill page tests
for (const slug of SLUGS) {
  test(`skill page: ${slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`[${slug}] ${err.message}`));

    const response = await page.goto(`/skill/${slug}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    expect(response?.status(), `${slug} should not 404`).not.toBe(404);

    // Wait for hydration
    await page.waitForTimeout(1000);

    const h1 = page.locator('h1');
    await expect(h1, `${slug} h1 should be visible`).toBeVisible({ timeout: 8000 });

    if (errors.length > 0) {
      throw new Error(`JS errors on /skill/${slug}:\n${errors.join('\n')}`);
    }
  });
}

// Visuais page tests
for (const slug of SLUGS) {
  test(`visuais page: ${slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`[${slug}/visuais] ${err.message}`));

    const response = await page.goto(`/skill/${slug}/visuais`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    expect(response?.status(), `${slug}/visuais should not 404`).not.toBe(404);

    // Wait for dynamic import to hydrate
    await page.waitForTimeout(2000);

    // Should have some content — either the visuais shell or a fallback
    const body = await page.locator('body').textContent();
    expect(body?.length ?? 0, `${slug}/visuais body should not be empty`).toBeGreaterThan(50);

    if (errors.length > 0) {
      throw new Error(`JS errors on /skill/${slug}/visuais:\n${errors.join('\n')}`);
    }
  });
}

// PDFs page tests
for (const slug of SLUGS) {
  test(`pdfs page: ${slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`[${slug}/pdfs] ${err.message}`));

    const response = await page.goto(`/skill/${slug}/pdfs`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    expect(response?.status(), `${slug}/pdfs should not 404`).not.toBe(404);

    // Wait for dynamic import to hydrate
    await page.waitForTimeout(2000);

    const body = await page.locator('body').textContent();
    expect(body?.length ?? 0, `${slug}/pdfs body should not be empty`).toBeGreaterThan(50);

    if (errors.length > 0) {
      throw new Error(`JS errors on /skill/${slug}/pdfs:\n${errors.join('\n')}`);
    }
  });
}
