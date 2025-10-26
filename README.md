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

### Docker Setup

1. Login to WhatsApp on localhost

2. Create a zip archive of whatsapp user data

```sh
zip -r udwa.zip user-data/whatsapp
```

3. Upload the user data zip to the server and unpack it

```sh
scp udwa.zip MyServer:/tmp/
```

4. Unpack the user data

```sh
cd /tmp
unzip data.zip -d /opt/docker-volumes/playwright-scripts/
rm data.zip
```

### GitHub Setup

1. Subscribe to the ntfy topic on a device other than existing device with WhatsApp

2. Run GitHub workflow "WhatsApp Setup"

3. Scan the login link from the ntfy topic
