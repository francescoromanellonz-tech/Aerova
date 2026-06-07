#!/usr/bin/env node
/**
 * scripts/prerender.mjs
 *
 * Playwright-based static prerender for the Aerova CSR SPA.
 * Runs after `vite build`, reads public/sitemap.xml for routes,
 * navigates each in Chromium, waits for Helmet to settle, patches
 * html[lang] per URL prefix, then writes build/<path>/index.html.
 *
 * Wired into: "build": "vite build && node scripts/prerender.mjs"
 *
 * Why Playwright over vite-plugin-ssg: no app restructuring required;
 * react-helmet-async + GSAP hydrate correctly inside the real browser.
 */

import { chromium } from 'playwright';
import { spawn }     from 'child_process';
import {
  readFileSync, mkdirSync, writeFileSync, existsSync, readdirSync,
} from 'fs';
import { join, dirname } from 'path';
import { homedir }       from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const BUILD_DIR = join(ROOT, 'build');
const SITEMAP   = join(ROOT, 'public', 'sitemap.xml');
const PORT      = 4173;
const BASE      = `http://localhost:${PORT}`;

// BCP 47 lang attribute per URL prefix
const LANG_MAP = { en: 'en', vi: 'vi', ru: 'ru', fr: 'fr', zh: 'zh-Hans' };

// ── helpers ──────────────────────────────────────────────────────────────────

function extractRoutes(xml) {
  const paths = new Set();
  // <loc>https://aerova.asia</loc>  → '/'
  // <loc>https://aerova.asia/vi/product</loc>  → '/vi/product'
  for (const m of xml.matchAll(/<loc>https:\/\/aerova\.asia(\/[^<]*)?<\/loc>/g)) {
    paths.add(m[1] || '/');
  }
  return [...paths];
}

function getLang(path) {
  const m = path.match(/^\/(vi|ru|fr|zh)(\/|$)/);
  return m ? m[1] : 'en';
}

function outFile(route) {
  const parts = (route === '/' ? '' : route.replace(/\/$/, '')).split('/').filter(Boolean);
  return join(BUILD_DIR, ...parts, 'index.html');
}

function patchLang(html, langAttr) {
  return html.replace(/^<html([^>]*)>/i, (_, attrs) => {
    const cleaned = attrs.replace(/\blang="[^"]*"/, '').trim();
    return `<html${cleaned ? ' ' + cleaned : ''} lang="${langAttr}">`;
  });
}

// Resolve an already-installed Chromium executable from the Playwright browser
// cache. Playwright's npm package pins one browser revision in its registry, but
// a slightly different revision is often what's actually downloaded on disk
// (e.g. wanted 1217, installed 1223). Rather than force a fresh download, find a
// usable headless-shell (preferred) or full Chromium and launch it explicitly.
// Returns undefined when nothing is found, so Playwright's own resolution (and
// PLAYWRIGHT_EXECUTABLE_PATH override) still applies — important for CI.
function findInstalledChromium() {
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  }

  const platform = process.platform;
  const cacheDir =
    process.env.PLAYWRIGHT_BROWSERS_PATH ||
    (platform === 'win32'
      ? join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'ms-playwright')
      : platform === 'darwin'
        ? join(homedir(), 'Library', 'Caches', 'ms-playwright')
        : join(homedir(), '.cache', 'ms-playwright'));

  if (!existsSync(cacheDir)) return undefined;

  // relative path to the executable inside a browser dir, per platform
  const exeRel = {
    'chromium-headless-shell': platform === 'win32'
      ? join('chrome-headless-shell-win64', 'chrome-headless-shell.exe')
      : platform === 'darwin'
        ? join('chrome-mac', 'headless_shell')
        : join('chrome-linux', 'headless_shell'),
    chromium: platform === 'win32'
      ? join('chrome-win64', 'chrome.exe')
      : platform === 'darwin'
        ? join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium')
        : join('chrome-linux', 'chrome'),
  };

  let dirs;
  try { dirs = readdirSync(cacheDir); } catch { return undefined; }

  const revOf = (name) => {
    const m = name.match(/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  // Prefer headless-shell over full chromium; within each, highest revision first.
  for (const [prefix, rel] of [
    ['chromium_headless_shell', exeRel['chromium-headless-shell']],
    ['chromium', exeRel.chromium],
  ]) {
    const re = new RegExp('^' + prefix + '-\\d+$');
    const candidates = dirs
      .filter((d) => re.test(d))
      .sort((a, b) => revOf(b) - revOf(a));
    for (const d of candidates) {
      const exe = join(cacheDir, d, rel);
      if (existsSync(exe)) return exe;
    }
  }
  return undefined;
}

function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
      cwd: ROOT, shell: true, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const timer = setTimeout(() => reject(new Error('vite preview timed out after 30s')), 30_000);
    const check = (data) => {
      if (data.toString().includes(String(PORT))) {
        clearTimeout(timer);
        resolve(proc);
      }
    };
    proc.stdout.on('data', check);
    proc.stderr.on('data', check);
    proc.on('error', reject);
  });
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(BUILD_DIR)) {
    console.error('[prerender] ERROR: build/ not found — run vite build first');
    process.exit(1);
  }

  const sitemap = readFileSync(SITEMAP, 'utf8');
  const routes  = extractRoutes(sitemap);
  console.log(`[prerender] ${routes.length} routes from sitemap`);

  console.log('[prerender] starting vite preview…');
  const server = await startServer();
  console.log(`[prerender] server ready on :${PORT}`);

  const executablePath = findInstalledChromium();
  if (executablePath) {
    console.log(`[prerender] using installed Chromium: ${executablePath}`);
  } else {
    console.log('[prerender] no cached Chromium found — relying on Playwright default');
  }
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const ctx = await browser.newContext({
    userAgent: 'AerovaPrerender/1.0 (+https://aerova.asia)',
    viewport:  { width: 1280, height: 800 },
  });

  let ok = 0, fail = 0;

  for (const route of routes) {
    const url      = `${BASE}${route}`;
    const dest     = outFile(route);
    const lang     = getLang(route);
    const langAttr = LANG_MAP[lang] ?? lang;

    try {
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
      // Allow Helmet and lazy page chunks to fully settle after network quiet
      await page.waitForTimeout(1200);

      let html = await page.evaluate(() => document.documentElement.outerHTML);
      html = `<!DOCTYPE html>\n${patchLang(html, langAttr)}`;

      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, html, 'utf8');
      process.stdout.write(`  ✓ ${route}\n`);
      ok++;
      await page.close();
    } catch (err) {
      process.stderr.write(`  ✗ ${route}: ${err.message}\n`);
      fail++;
    }
  }

  await browser.close();
  try { server.kill('SIGTERM'); } catch { /* already gone */ }
  // Windows: `vite preview` is spawned with shell:true, so SIGTERM hits the cmd
  // wrapper and usually does NOT reach the node child — leaving port 4173 held
  // and THIS process hung on the still-open child stdio pipes (looks "stuck"
  // even though prerendering finished). Force-kill the whole process tree.
  if (process.platform === 'win32' && server.pid) {
    try { spawn('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' }); }
    catch { /* best effort */ }
  }

  console.log(`\n[prerender] ${ok} succeeded, ${fail} failed`);
  // Hard-exit so a lingering child handle can never keep the process alive.
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[prerender] fatal:', err);
  process.exit(1);
});
