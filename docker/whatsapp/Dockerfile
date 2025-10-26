# Use the official Playwright image (includes Node + browsers)
FROM mcr.microsoft.com/playwright:v1.56.1-noble

# Install cron
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Playwright project
COPY package.json ./package.json
RUN npm install
COPY scripts/whatsapp/* .

# Copy the Playwright script and entrypoint script into the image
COPY docker/whatsapp/playwright.sh /opt/scripts/playwright.sh
COPY docker/whatsapp/entrypoint.sh /opt/scripts/entrypoint.sh

# Make sure the scripts are executable
RUN chmod +x /opt/scripts/playwright.sh /opt/scripts/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/opt/scripts/entrypoint.sh"]
