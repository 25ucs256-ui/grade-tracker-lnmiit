# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LNMIIT Dashboard Pro — a static frontend dashboard for LNMIIT students providing grade tracking, AI study advisor, mess menus, and exam countdowns. No build system or package manager; it's vanilla HTML/CSS/JS served directly.

## Development

**Run locally:** Open `index.html` in a browser. No dev server required.

**Deployment:** Hosted on Vercel as a static site. `vercel-build.sh` generates `js/config.js` from environment variables at build time.

**Configuration:** Copy `js/config.example.js` to `js/config.js` with your API keys. `js/config.js` and `.env` are gitignored — never commit them.

## Architecture

- **Single-page app** — everything lives in one `index.html` (~80KB) with Tailwind CSS via CDN
- **`js/app.js`** — main application logic: login validation (roll numbers matching `25UCS|UCC|UEC###`), grade calculation, AI advisor integration, Discord/Telegram webhook notifications, and all UI interactions
- **`js/students.js`** — roll number → student name mapping for personalized greetings
- **`js/notifications.js`** — in-app notification bell UI (IIFE, self-contained)
- **`js/burn-transition.js`** — WebGL burning paper transition effect between login and dashboard (IIFE, exposes `window.startBurnTransition`)
- **`js/memento-mori.js`** — Three.js/WebGL background animation (CC BY-NC-ND 4.0 licensed artwork — do not modify the visual output)
- **`js/config.js`** — runtime configuration injected via `window.APP_CONFIG` (gitignored, generated at build time on Vercel)
- **`css/styles.css`** — custom styles supplementing Tailwind

All state is stored in `localStorage` (grades, user preferences). The app communicates with external services (Discord webhooks, Telegram bot, Groq/Gemini/NVIDIA APIs) but has no backend.

## Key Patterns

- Global config accessed via `window.APP_CONFIG` — always null-check before use
- AI advisor supports three providers (`groq`, `gemini`, `nvidia`) configured via `advisorProvider`
- Login restricted to 25th year-of-completion roll numbers (CSE, CCE, ECE branches)
- The `css/` directory contains a duplicate/older copy of the project — the root-level files are the canonical source

## External Dependencies (CDN)

- Tailwind CSS, Canvas Confetti, Three.js, Google Fonts (Outfit, Syne, Plus Jakarta Sans, Neo Sans Pro)
