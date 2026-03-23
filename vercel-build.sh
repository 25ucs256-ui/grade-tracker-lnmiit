#!/bin/bash
# Generate the config file from environment variables at build time
printf 'window.APP_CONFIG = { discordWebhook: "%s", gradeSyncWebhook: "%s", telegramBotToken: "%s", telegramChatId: "%s", advisorKey: "%s", advisorProvider: "%s", firebaseApiKey: "%s", firebaseAuthDomain: "%s", firebaseProjectId: "%s", firebaseStorageBucket: "%s", firebaseMessagingSenderId: "%s", firebaseAppId: "%s" };' "$DISCORD_WEBHOOK" "$GRADE_SYNC_WEBHOOK" "$TELEGRAM_BOT_TOKEN" "$TELEGRAM_CHAT_ID" "$ADVISOR_KEY" "$ADVISOR_PROVIDER" "$FIREBASE_API_KEY" "$FIREBASE_AUTH_DOMAIN" "$FIREBASE_PROJECT_ID" "$FIREBASE_STORAGE_BUCKET" "$FIREBASE_MESSAGING_SENDER_ID" "$FIREBASE_APP_ID" > js/config.js

# Output the file for debugging (optional/private)
echo "Configuration generated successfully."
