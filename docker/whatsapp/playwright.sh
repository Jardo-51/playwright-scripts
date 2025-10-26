#!/bin/bash
set -e

#!/bin/bash
echo "[$(date)] Running Playwright script..."
cd /app
export PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
node check-messages.js
echo "[$(date)] Playwright script finished."
