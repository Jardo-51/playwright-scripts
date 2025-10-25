import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com');

  await page.pause();

  await page.context().storageState({ path: 'state/whatsapp.json' });
  await browser.close();
}

main();
