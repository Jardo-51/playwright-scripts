import { chromium } from 'playwright';
import 'dotenv/config';
import fs from 'fs';

async function main() {
  const browser = await chromium.launchPersistentContext( 'user-data/whatsapp', { headless: process.env.HEADLESS !== 'false' });
  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com');
  await page.waitForTimeout(20_000);
  await page.screenshot({ path: 'login-code.png' });

  await fetch('https://ntfy.sh/' + process.env.WHATSAPP_TOPIC, {
    method: 'PUT',
    body: fs.createReadStream('login-code.png'),
    duplex: 'half',
  });

  console.log('Login QR code sent to topic. You have 2 minutes to login...');
  await page.waitForTimeout(120_000);

  await browser.close();
}

main();
