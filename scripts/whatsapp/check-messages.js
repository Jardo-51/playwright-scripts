import { firefox } from 'playwright';
import 'dotenv/config';
import fs from 'fs';

async function sendToTopic(payload) {
  const response = await fetch('https://ntfy.sh/' + process.env.WHATSAPP_TOPIC, payload);
  if (!response.ok) {
    console.error(`Sending to ntfy fauled: ${response.status} ${response.statusText}`);
  }
}

async function login(page) {
  console.log('Waiting for QR code to load...')
  await page.waitForTimeout(15_000);
  await page.screenshot({ path: 'login-code.png' });

  await sendToTopic({
    method: 'PUT',
    body: fs.createReadStream('login-code.png'),
    duplex: 'half',
  });

  console.log('Login QR code sent to topic. You have 2 minutes to login...');
  await page.waitForTimeout(120_000);
}

async function readChat(page, chat) {
  await chat.click();
  await page.waitForTimeout(1000);

  const title = await page.locator('#main').locator('header').locator('span').first().innerText();

  const unreadMessages = page.locator('xpath=//*[@id="main"]//div[.//span[contains(text(), "unread")]]/following::div[@role="row"]');
  for (const message of await unreadMessages.all()) {
    const text = await message.locator('span').nth(4).innerText();
    await sendToTopic({
      method: 'POST',
      body: title + ': ' + text,
    })
  }
}

async function main() {

  const browser = await firefox.launchPersistentContext( 'user-data/whatsapp', { headless: process.env.HEADLESS !== 'false' });
  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com');

  // wait for page load, potentially trigger login
  const maxDuration = 30_000;
  const start = Date.now();
  while (Date.now() - start < maxDuration) {

    await page.waitForTimeout(5_000);

    if (await page.getByRole('tab', { name: 'Unread' }).isVisible()) {
      break;
    }

    if (await page.getByText('Steps to log in').isVisible()) {
      console.log('Executing login');
      await login(page);
      break;
    }
  }

  await page.getByRole('tab', { name: 'Unread' }).click();
  await page.waitForTimeout(500);

  const allUnreadChats = page.getByRole('row');
  console.log("Chats with unread messages: " + await allUnreadChats.count());
  for (const chat of await allUnreadChats.all()) {

    const chatMuted = await chat.locator('span').filter({ hasText: /^mute-notifications-refreshed$/ }).isVisible();
    if (!chatMuted) {
      console.log('Reading messages...');
      await readChat(page, chat);
    } else {
      console.log('Chat muted, skipping...');
    }
  }

  await browser.close();
}

main();
