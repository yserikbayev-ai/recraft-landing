// Run with Playwright available in Node's module search path.
const { chromium } = require('playwright');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { copyFileSync } = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(resolve(__dirname, 'social-preview.html')).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const output = resolve(__dirname, '../assets/refactor-social-20260916.png');
    await page.screenshot({ path: output });
    // Keep the legacy image endpoint consistent for previously cached page metadata.
    copyFileSync(output, resolve(__dirname, '../og.png'));
    console.log(output);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
