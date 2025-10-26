## WhatsApp

### Login

```sh
pnpm exec node scripts/whatsapp/login.js
```

### Check Messages

```sh
pnpm exec node scripts/whatsapp/check-messages.js
```

### Run Codegen

```sh
pnpm playwright codegen --user-data-dir=user-data/whatsapp https://web.whatsapp.com
```

### Setup on GitHub or Docker

1. Subscribe to the ntfy topic on a device other than existing device with WhatsApp

2. When the script runs for the first time, it will send a QR code to the ntfy topic

3. Uset the QR from the ntfy topic to link a new device in WhatsApp
