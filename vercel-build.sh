#!/bin/bash
# Generate the config file from environment variables at build time
printf 'window.APP_CONFIG = { discordWebhook: "%s", gradeSyncWebhook: "%s", telegramBotToken: "%s", telegramChatId: "%s", advisorKey: "%s", advisorProvider: "%s" };' "$DISCORD_WEBHOOK" "$GRADE_SYNC_WEBHOOK" "$TELEGRAM_BOT_TOKEN" "$TELEGRAM_CHAT_ID" "$ADVISOR_KEY" "$ADVISOR_PROVIDER" > js/config.js

# Output the file for debugging (optional/private)
echo "Configuration generated successfully."
