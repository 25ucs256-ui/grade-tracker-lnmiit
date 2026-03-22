// ============ PROJECT CONFIGURATION (EXAMPLE) ============
// Copy this file to config.js and the dashboard will automatically load it.
// config.js is ignored by git to keep your secrets safe.

window.APP_CONFIG = {
    // Discord Webhook for login alerts
    discordWebhook: "YOUR_DISCORD_WEBHOOK_URL_HERE",

    // Discord Webhook for grade sync updates
    gradeSyncWebhook: "YOUR_GRADE_SYNC_WEBHOOK_URL_HERE",
    
    // Telegram Bot Token (e.g., '123456:ABC-DEF...')
    telegramBotToken: "YOUR_TELEGRAM_BOT_TOKEN_HERE",
    
    // Telegram Chat ID (e.g., '1485819897')
    telegramChatId: "YOUR_TELEGRAM_CHAT_ID_HERE",

    // AI Study Advisor Configuration (e.g. Google Gemini or Groq)
    advisorKey: "YOUR_AI_API_KEY_HERE",
    advisorProvider: "groq" // Options: 'gemini', 'nvidia', 'groq'
};
