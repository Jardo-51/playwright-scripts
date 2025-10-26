#!/bin/bash
set -e

# Default schedule if not provided
CRON_SCHEDULE="${CRON_SCHEDULE:-10 5-20 * * *}"

echo "Starting with cron schedule: ${CRON_SCHEDULE}"

ENV_FILE="/app/.env"
echo "WHATSAPP_TOPIC=${WHATSAPP_TOPIC}" >> ${ENV_FILE}

# Write the cron job to a file
# The cron job calls our playwright.sh script.
CRON_FILE="/etc/cron.d/playwright"
echo "$CRON_SCHEDULE /opt/scripts/playwright.sh >> /var/log/playwright.log 2>&1" > ${CRON_FILE}

# Give execution rights on the cron job
chmod 0644 ${CRON_FILE}

# Apply cron job
crontab ${CRON_FILE}

# Start cron in the foreground (to keep the container running)
# cron -f

# Start cron in the background
service cron start
touch /var/log/playwright.log
tail -f /var/log/playwright.log
