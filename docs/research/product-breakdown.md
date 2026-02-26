# Meeting Bingo — Product Research & Breakdown

## Problem Statement

Meetings are full of corporate buzzwords ("synergy", "circle back", "move the needle", etc.). Sitting through them is tedious. This tool gives you a lightweight, low-friction way to track buzzword hits in real time and get a satisfying signal when you've reached a threshold — the bingo moment.

---

## Core Concept

A single-player game played silently during a meeting. The user has a bingo card (or a simpler hit-counter) populated with common corporate buzzwords. When a buzzword is spoken, they tap it. When enough are hit, they win (internally — no disruption required).

---

## User Stories

- As a meeting participant, I want to tap a buzzword when I hear it, so I can track hits without disrupting the meeting.
- As a user, I want to know when I've hit "bingo" (a winning pattern or threshold), so I get a moment of satisfaction.
- As a user, I want a default set of buzzwords so I can start immediately without setup.
- As a user, I want to be able to customise my buzzword list so it reflects the jargon in my specific workplace.
- As a user, I want the interface to be discreet enough to use on a phone or laptop during a meeting.

---

## Feature Breakdown

### MVP (Must Have)

| Feature | Description |
|--------|-------------|
| Buzzword grid | 5×5 bingo card (or NxN) of buzzword tiles |
| Tap to mark | Tap a tile to mark it as heard |
| Win detection | Detect a completed row, column, or diagonal (classic bingo) |
| Win state | Visual/subtle win feedback (no sound by default) |
| Default word list | Pre-loaded with common corporate buzzwords |
| Free space | Optional centre "free" tile |
| Randomised card | Words shuffled on each new game |

### Nice to Have (Post-MVP)

| Feature | Description |
|--------|-------------|
| Custom word lists | Add/remove/edit buzzwords |
| Saved lists | Persist custom lists across sessions |
| Hit counter mode | Alternative to bingo — just count how many buzzwords heard |
| Multiple cards | Switch between themed word lists (tech, consulting, sales, etc.) |
| Share a card | Generate a shareable card so a whole team can play together |
| History | Log of which words were hit in a session |
| Dark mode | Comfortable for discreet phone use |
| PWA / installable | Works offline, adds to home screen |

---

## Buzzword Candidates (Default List)

A starter set — can be expanded:

> synergy, circle back, move the needle, low-hanging fruit, deep dive, bandwidth, align, pivot, leverage, scalable, agile, disruption, holistic, robust, stakeholder, deliverable, ideate, boil the ocean, take this offline, action item, unpack, touch base, at the end of the day, going forward, in the weeds, tee up, value-add, best practice, paradigm shift, buy-in

---

## UX Considerations

- **Discreet first**: UI should not look obviously like a game if someone glances at a screen. Neutral colours, no flashy animations by default.
- **One-handed use**: Works on a phone held under a table or on a laptop trackpad.
- **No login required**: Zero friction to start. State can be ephemeral (session only) for MVP.
- **Fast load**: Static or near-static app. No waiting.

---

## Technical Approach (Options)

### Option A — Static Web App (Recommended for MVP)
- Plain HTML/CSS/JS or a lightweight framework (e.g. React, Svelte)
- No backend required for MVP
- Deployable to Vercel (already in toolchain)
- LocalStorage for persisting custom word lists

### Option B — Full Stack
- Backend API for shared cards, multiplayer, or persistent history
- Overkill for MVP but extensible if multiplayer/sharing is prioritised

**Recommendation**: Start with Option A. Ship fast, validate the concept, add backend only when sharing or multi-user features are needed.

---

## Open Questions

1. Bingo pattern win, or simpler "hit X buzzwords" threshold? Both?
2. Should cards regenerate between meetings, or persist until the user resets?
3. Any audio feedback on win, or always silent?
4. Multiplayer / shared sessions in scope at all?
5. Target device? Mobile-first, or desktop (laptop during meeting)?

---

## Out of Scope (for now)

- AI-powered buzzword detection (speech recognition)
- Social/leaderboard features
- Native mobile apps (iOS/Android)
- Analytics or tracking of any kind
