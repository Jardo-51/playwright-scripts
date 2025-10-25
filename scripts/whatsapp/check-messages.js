import { chromium } from 'playwright';
import 'dotenv/config';

async function main() {
  const browser = await chromium.launchPersistentContext( 'user-data/whatsapp', { headless: process.env.HEADLESS !== 'false' });
  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com');

  await page.pause();

  await browser.close();
}

main();
