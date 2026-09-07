# Installing the AZMX skills

A step-by-step guide for anyone at AZMX, or working with AZMX, who wants Claude Code, Cursor, Codex or GitHub Copilot to produce work in the AZMX, Colab or Majarah identity. No developer background needed. It takes about five minutes.

## What you get

Three skills. Each one teaches your AI agent one design system, so decks, emails, documents and social graphics come out on-brand without you briefing it every time.

| Skill | Use it for | Call it with |
|---|---|---|
| AZMX brand | Anything under the AZMX identity: presentations, emails, reports, web pages, social posts, Arabic localisation, the communication strategy | `/azmx-brand` |
| Colab design | Colab decks, research reports, findings decks, bilingual EN/AR layouts | `/colab-design` |
| Majarah design | Majarah meetup decks, community slides, event collateral, social graphics | `/majarah-design` |

## Before you start

You need two things on your computer.

1. **An AI coding tool.** [Claude Code](https://claude.com/claude-code), Cursor, Codex or GitHub Copilot, installed and signed in. The commands below are written for Claude Code; the section after Step 3 covers the others.
2. **Node.js.** The installer runs on it. Download the LTS version from [nodejs.org](https://nodejs.org) and run the installer with the default settings.

To check Node.js is ready, open a terminal (next step) and type `node -v`. A version number such as `v22.11.0` means you are set.

## Step 1: open a terminal

- **Mac:** press Command and Space, type `Terminal`, press Return.
- **Windows:** press the Windows key, type `PowerShell`, press Enter.

A window with a blinking cursor appears. Everything below is typed, or pasted, into that window.

## Step 2: paste the command for the skill you need

AZMX brand:

```
npx skills@latest add Gamaleldientarek/azmx-brand -g -a claude-code -y
```

Colab design:

```
npx skills@latest add Gamaleldientarek/colab-design -g -a claude-code -y
```

Majarah design:

```
npx skills@latest add Gamaleldientarek/majarah-design -g -a claude-code -y
```

Want all three? Run the three commands one after the other.

Press Enter. The first run downloads the installer, which can take a minute. It finishes with `Done!`.

## Step 3: restart Claude Code

Close Claude Code and open it again. Type `/azmx-brand`, or the name of the skill you installed. If it responds, the skill is in place.

From now on you do not need to call it by name. Ask for an AZMX newsletter, a Colab findings deck or a Majarah event post, and the right skill loads on its own.

## Using Cursor, Codex or Copilot instead

Same commands, with one word changed. Replace `claude-code` with the tool you use:

```
npx skills@latest add Gamaleldientarek/azmx-brand -g -a cursor -y
npx skills@latest add Gamaleldientarek/azmx-brand -g -a codex -y
npx skills@latest add Gamaleldientarek/azmx-brand -g -a github-copilot -y
```

Swap `azmx-brand` for `colab-design` or `majarah-design` as needed. To install into every tool on your machine in one go, use `-a '*'` in place of the tool name. Then restart the tool.

## Updating

The skills improve over time. To get the latest version of everything you installed:

```
npx skills@latest update -g
```

## If something goes wrong

**`npx` is not recognised, or command not found.** Node.js is not installed, or the terminal was opened before you installed it. Install Node.js, close the terminal, open a new one, try again.

**The command asks a question instead of finishing.** Answer it with the arrow keys and Enter. This happens when `-y` was left off the command.

**Claude Code does not respond to `/azmx-brand`.** Restart Claude Code, then run `/doctor` inside it. The skills live in a folder called `.claude/skills` inside your home folder. If `azmx-brand` is there, the install worked.

**You use Cursor, Codex or Copilot.** See the section above: the command is the same with `-a cursor`, `-a codex` or `-a github-copilot`.

Anything else: reply to whoever sent you this guide.

## About the fonts

The AzmX and thmanyah serif display fonts ship with the AZMX brand skill. They are the property of AZMX and its licensors and are licensed for AZMX work only.
