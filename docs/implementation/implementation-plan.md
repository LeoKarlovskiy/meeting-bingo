# Meeting Bingo — Implementation Plan

## Context

Meeting Bingo is a browser-based bingo game where buzzwords are auto-detected via live speech recognition during corporate meetings. No application code exists yet — only research docs (`docs/research/`). This plan scaffolds the full MVP from scratch, following the architecture and PRD already defined.

**Stack**: React 18 + TypeScript · Vite · Tailwind CSS · Web Speech API · canvas-confetti · Vercel
**Goal**: Zero-cost, fully client-side app. No backend, no auth.

---

## Phase 1: Project Bootstrap

```bash
npm create vite@latest . -- --template react-ts
npm install canvas-confetti
npm install -D tailwindcss postcss autoprefixer @types/canvas-confetti
npx tailwindcss init -p
```

**Files to create/configure**:
- `tailwind.config.js` — content glob for `src/**/*.{ts,tsx}`
- `postcss.config.js` — autoprefixer
- `src/index.css` — Tailwind directives
- `vite.config.ts` — port 3000, sourcemap
- `index.html` — app shell

---

## Phase 2: Types & Data

### `src/types/index.ts`
Define all interfaces per architecture doc:
- `CategoryId`, `Category`
- `BingoSquare`, `BingoCard`
- `GameStatus`, `GameState`, `WinningLine`
- `SpeechRecognitionState`, `Toast`

### `src/data/categories.ts`
Three `CATEGORIES` entries (id, name, description, icon, words[]):
- `agile` — 47 words (sprint, backlog, standup…)
- `corporate` — 45 words (synergy, circle back…)
- `tech` — 45 words (API, cloud, microservices…)

---

## Phase 3: Core Logic (`src/lib/`)

### `cardGenerator.ts`
- `shuffle<T>(array)` — Fisher-Yates
- `generateCard(categoryId)` → `BingoCard` — 5×5 grid, center is FREE space (pre-filled)
- `getCardWords(card)` → `string[]`

### `bingoChecker.ts`
- `checkForBingo(card)` → `WinningLine | null` — checks 5 rows + 5 cols + 2 diagonals
- `countFilled(card)` → `number`
- `getClosestToWin(card)` → `{ needed, line } | null` — for UI hints

### `wordDetector.ts`
- `detectWords(transcript, cardWords, alreadyFilled)` → `string[]`
  - Word-boundary regex for single words
  - Substring match for multi-word phrases (e.g. "circle back")
- `WORD_ALIASES` map — handles CI/CD, MVP, ROI, API, DevOps variants
- `detectWordsWithAliases(...)` — extends basic detection with alias map

### `shareUtils.ts`
- `buildShareText(game)` → formatted text for clipboard
- `shareResult(game)` — uses Web Share API with clipboard fallback

### `src/lib/utils.ts`
- `cn(...classes)` — simple className joiner (no external dep)

---

## Phase 4: Hooks (`src/hooks/`)

### `useSpeechRecognition.ts`
- Detects `window.SpeechRecognition || window.webkitSpeechRecognition`
- Config: `continuous: true`, `interimResults: true`, `lang: 'en-US'`
- Auto-restarts on `onend` if still in listening state
- Returns: `{ isSupported, isListening, transcript, interimTranscript, error, startListening, stopListening, resetTranscript }`

### `useLocalStorage.ts`
- Generic `useLocalStorage<T>(key, defaultValue)` hook for game state persistence

### `useGame.ts`
- Wraps `GameState` + `setGame` with action helpers: `fillSquare`, `toggleSquare`, `startNewGame`, `resetGame`
- Calls `checkForBingo` on each fill and triggers win callback

---

## Phase 5: Components (`src/components/`)

### Shared UI (`src/components/ui/`)
- `Button.tsx` — variant props: `primary | secondary | ghost`
- `Toast.tsx` — auto-dismiss notification for detected words

### Screens

| Component | Screen state | Key responsibilities |
|---|---|---|
| `LandingPage.tsx` | `'landing'` | Hero, "New Game" CTA, How It Works |
| `CategorySelect.tsx` | `'category'` | 3 category cards with icon + sample words, Back button |
| `GameBoard.tsx` | `'game'` | Composes header, card, transcript panel, controls |
| `BingoCard.tsx` | inside GameBoard | 5×5 CSS grid, passes winning square IDs down |
| `BingoSquare.tsx` | inside BingoCard | Handles filled/auto-filled/free/winning states with Tailwind classes |
| `TranscriptPanel.tsx` | inside GameBoard | Live transcript, interim text, detected word badges |
| `GameControls.tsx` | inside GameBoard | New Card + Start/Stop Listening buttons |
| `WinScreen.tsx` | `'win'` | Confetti, stats (time, winning word, count), Share + Play Again |

---

## Phase 6: App Shell (`src/App.tsx`)

Simple screen-state router (`'landing' | 'category' | 'game' | 'win'`):
- No router dependency — just `useState<Screen>`
- Manages top-level `GameState`
- Wires: `handleStart` → `handleCategorySelect` → `handleWin` → `handlePlayAgain`

---

## Phase 7: Win Celebration

In `WinScreen.tsx`:
```ts
import confetti from 'canvas-confetti';
confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
```

Winning line squares highlighted green (`ring-2 ring-green-300 bg-green-500`).

---

## Phase 8: localStorage Persistence

Persist `GameState` to `localStorage` key `meeting-bingo-game` on every state change. Rehydrate on load — resume in-progress game if status is `'playing'`.

---

## Phase 9: Deploy

```bash
vercel --prod
```

No `vercel.json` required — default Vite static output config works.

---

## Final File Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── types/index.ts
├── data/categories.ts
├── lib/
│   ├── cardGenerator.ts
│   ├── bingoChecker.ts
│   ├── wordDetector.ts
│   ├── shareUtils.ts
│   └── utils.ts
├── hooks/
│   ├── useSpeechRecognition.ts
│   ├── useGame.ts
│   └── useLocalStorage.ts
└── components/
    ├── LandingPage.tsx
    ├── CategorySelect.tsx
    ├── GameBoard.tsx
    ├── BingoCard.tsx
    ├── BingoSquare.tsx
    ├── TranscriptPanel.tsx
    ├── GameControls.tsx
    ├── WinScreen.tsx
    └── ui/
        ├── Button.tsx
        └── Toast.tsx
```

---

## Verification Checklist

- [ ] `npm run dev` — app loads at localhost:3000
- [ ] Landing → Category → Game flow navigates correctly
- [ ] Manual square tap fills/unfills
- [ ] Filling 5 in a row triggers BINGO and shows WinScreen with confetti
- [ ] Enable microphone → speak a card word → square auto-fills with toast
- [ ] Share button copies result text to clipboard
- [ ] Reload page → game state restored from localStorage
- [ ] `npm run build && npm run preview` — production build works
- [ ] Deploy to Vercel — live URL accessible
