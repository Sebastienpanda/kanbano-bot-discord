# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kanbano-bot is a Discord bot built with discord.js v14 and TypeScript (ESM). It uses slash commands registered per-guild.

## Commands

```bash
pnpm dev          # Run in dev mode with hot-reload (tsx --watch)
pnpm build        # Compile TypeScript (output to dist/)
pnpm start        # Run compiled JS from dist/
```

No test framework is configured.

## Environment Variables

The `.env` file must contain `DISCORD_TOKEN`, `GUILD_ID`, and `CLIENT_ID`.

## Architecture

The bot follows a file-system based auto-discovery pattern for both events and commands.

**Entry point:** `main.ts` — creates the Discord client and calls `registerEvents`.

**Auto-registration flow:**
1. On startup, `helpers/register-events.ts` scans `events/` subfolders and dynamically imports each `.ts` file. Each event module exports a default object with `name`, `once` (boolean), and `execute`.
2. The `ready` event (`events/ready/ready.ts`) triggers `helpers/register-commands.ts`, which scans `commands/` subfolders and registers all slash commands to the Discord API via `Routes.applicationGuildCommands` (guild-scoped, not global).
3. The `interactionCreate` event (`events/interaction/interaction.ts`) dispatches incoming slash commands to the matching command handler, with per-command cooldown support.

**Adding a new command:** Create a file in `commands/<category>/` exporting a default object with `data` (SlashCommandBuilder) and `execute(interaction)`. Optional `cooldown` (seconds, default 3).

**Adding a new event:** Create a file in `events/<event-name>/` exporting a default object with `name` (Discord event name), `once` (boolean), and `execute`.

**Types:** `types/client.ts` extends the Discord Client with `commands` and `cooldowns` collections. `types/command.ts` defines the `Command` interface.

## Key Conventions

- ESM throughout (`"type": "module"` in package.json) — all local imports use `.js` extensions
- `__dirname` is manually derived via `fileURLToPath(import.meta.url)` since ESM doesn't provide it natively
- Commands are registered as guild commands (fast update) not global commands (can take up to 1h)
