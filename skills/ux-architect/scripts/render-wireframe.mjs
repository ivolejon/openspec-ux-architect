#!/usr/bin/env node
/**
 * Render a UI wireframe HTML file to PNG images at one or more viewports.
 *
 *   node .pi/skills/ux-architect/scripts/render-wireframe.mjs \
 *     --html /tmp/ux-wireframes/accept-route.html \
 *     --out /tmp/ux-wireframes/accept-route \
 *     --state page --state confirm \
 *     --viewport 1440x900 --viewport 1100x900 --viewport 390x844
 *
 * The kit in references/wireframe-template.html switches state through the
 * data-state attribute on <body>, so one file renders every state.
 * Chromium comes from apps/web's Playwright install; no other dependency.
 */

import { createRequire } from 'node:module';
import { mkdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../..');

const DEFAULT_VIEWPORTS = ['1440x900', '390x844'];

function parseArgs(argv) {
  const options = { html: undefined, out: undefined, states: [], viewports: [], scale: 2, fullPage: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined) throw new Error(`${arg} needs a value`);
      return next;
    };
    switch (arg) {
      case '--html': options.html = value(); break;
      case '--out': options.out = value(); break;
      case '--state': options.states.push(value()); break;
      case '--viewport': options.viewports.push(value()); break;
      case '--playwright-root': options.playwrightRoot = value(); break;
      case '--scale': options.scale = Number(value()); break;
      case '--no-full-page': options.fullPage = false; break;
      case '-h':
      case '--help': options.help = true; break;
      default: throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function parseViewport(text) {
  const match = /^(\d+)x(\d+)$/.exec(text);
  if (!match) throw new Error(`viewport must look like 1440x900, got: ${text}`);
  return { width: Number(match[1]), height: Number(match[2]) };
}

function usage() {
  return [
    'render-wireframe.mjs --html <file> [--out <dir>] [--state <name>]...',
    '                    [--viewport 1440x900]... [--playwright-root <dir>]',
    '                    [--scale 2] [--no-full-page]',
    '',
    `Default viewports: ${DEFAULT_VIEWPORTS.join(', ')}`,
    'Default state: the data-state the file already carries.',
  ].join('\n');
}

/**
 * Playwright is not a dependency of this script. Find the copy the project it runs
 * in already installed, so the skill works whether it lives in the project at
 * `.agents/skills/`, at user level, or anywhere else.
 *
 * Order: an explicit `--playwright-root`, the same value from the environment, the
 * `apps/web` app of the current directory, the current directory itself, then the
 * directory above the script.
 */
function loadPlaywright(explicitRoot) {
  const cwd = process.cwd();
  const roots = [
    explicitRoot,
    process.env.WIREFRAME_PLAYWRIGHT_ROOT,
    join(cwd, 'apps/web'),
    cwd,
    join(here, '..'),
    repoRoot,
  ].filter(Boolean);

  for (const root of roots) {
    try {
      const fromRoot = createRequire(join(root, 'package.json'));
      const mod = fromRoot('playwright');
      if (mod?.chromium) return mod;
    } catch {
      // try the next root
    }
  }

  throw new Error(
    `Playwright was not found. Run "npm ci" and "npx playwright install chromium" in the project that holds it, ` +
      `or pass --playwright-root <dir>. Tried: ${roots.join(', ')}`,
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (!options.html) throw new Error(`--html is required\n\n${usage()}`);

  const htmlPath = resolve(options.html);
  const info = await stat(htmlPath).catch(() => undefined);
  if (!info?.isFile()) throw new Error(`no such file: ${htmlPath}`);

  const slug = basename(htmlPath, extname(htmlPath));
  const outDir = resolve(options.out ?? join('/tmp/ux-wireframes', slug));
  await mkdir(outDir, { recursive: true });

  const viewports = options.viewports.length ? options.viewports.map(parseViewport) : DEFAULT_VIEWPORTS.map(parseViewport);
  const states = options.states.length ? options.states : [undefined];

  const { chromium } = loadPlaywright(options.playwrightRoot);

  const browser = await chromium.launch();
  const written = [];
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: options.scale,
      });
      const page = await context.newPage();
      await page.goto(pathToFileURL(htmlPath).href);
      await page.evaluate(() => document.fonts.ready);
      for (const state of states) {
        if (state) {
          await page.evaluate((next) => {
            document.body.dataset.state = next;
          }, state);
          await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
        }
        const name = [slug, state, `${viewport.width}x${viewport.height}`].filter(Boolean).join('-') + '.png';
        const file = join(outDir, name);
        await page.screenshot({ path: file, fullPage: options.fullPage });
        written.push(file);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  for (const file of written) console.log(file);
}

main().catch((error) => {
  console.error(`render-wireframe: ${error.message}`);
  process.exit(1);
});
