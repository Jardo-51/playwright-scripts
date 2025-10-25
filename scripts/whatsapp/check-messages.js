import { chromium } from 'playwright';
import 'dotenv/config';

async function readChat(page, chat) {
  await chat.click();
  await page.waitForTimeout(1000);

  const title = await page.locator('#main').locator('header').locator('span').first().innerText();

  const unreadMessages = page.locator('xpath=//*[@id="main"]//div[.//span[contains(text(), "unread")]]/following::div[@role="row"]');
  for (const message of await unreadMessages.all()) {
    const text = await message.locator('span').nth(4).innerText();
    await fetch('https://ntfy.sh/' + process.env.WHATSAPP_TOPIC, {
      method: 'POST',
      body: title + ': ' + text,
    })
  }
}

async function main() {
  const browser = await chromium.launchPersistentContext( 'user-data/whatsapp', { headless: process.env.HEADLESS !== 'false' });
  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com');
  await page.getByRole('tab', { name: 'Unread' }).click();
  await page.waitForTimeout(500);

  const allUnreadChats = page.getByRole('row');
  for (const chat of await allUnreadChats.all()) {

    const chatMuted = await chat.locator('span').filter({ hasText: /^mute-notifications-refreshed$/ }).isVisible();
    if (!chatMuted) {
      await readChat(page, chat);
    }
  }

  await browser.close();
}

main();
