# New Bingo Categories — Implementation Plan

Three new card themes: **Trump Talk**, **Hockey**, **AI Talk**

---

## Overview

### Files to change

| File | Change |
|------|--------|
| `src/types/index.ts` | Extend `CategoryId` union |
| `src/data/categories.ts` | Add 3 new `CATEGORIES` entries |
| `src/lib/wordDetector.ts` | Add `WORD_ALIASES` entries for speech recognition variants |

No new files needed. No routing, state, or UI component changes required — the `CategorySelect` screen already renders all entries in `CATEGORIES` dynamically.

---

## Step 1 — Extend `CategoryId`

**File**: `src/types/index.ts`, line 1

```ts
// Before
export type CategoryId = 'agile' | 'corporate' | 'tech';

// After
export type CategoryId = 'agile' | 'corporate' | 'tech' | 'trump' | 'hockey' | 'ai-talk';
```

---

## Step 2 — Add Category Entries

**File**: `src/data/categories.ts` — append to the `CATEGORIES` array.

---

### 2a. Trump Talk

```ts
{
  id: 'trump',
  name: 'Trump Talk',
  description: 'Tremendous words, fake news, and winning bigly',
  icon: '🇺🇸',
  words: [
    'tremendous', 'huge', 'beautiful', 'perfect', 'incredible',
    'disaster', 'total disaster', 'witch hunt', 'fake news', 'very unfair',
    'MAGA', 'America first', 'drain the swamp', 'deep state', 'winning',
    'loser', 'SAD', 'believe me', 'many people are saying', 'the best',
    'low energy', 'failing', 'rigged', 'hoax', 'corrupt',
    'enemy of the people', 'very stable genius', 'covfefe', 'bigly', 'no collusion',
    'perfect call', 'like never before', 'frankly', 'nobody knew', 'historic',
    'unprecedented', 'strong', 'weak', 'tariff', 'trade deal',
    'the wall', 'great again', 'nobody knows more', "we'll see", 'tremendous success',
  ],
},
```

**Word alias additions** (for `WORD_ALIASES` in `wordDetector.ts`):

| Card word | Speech recognition variants |
|---|---|
| `'MAGA'` | `'maga'`, `'make america great again'` |
| `'SAD'` | `'sad'` (already a common word — detector relies on card context) |
| `'covfefe'` | `'covfefe'` (speech API unlikely to transcribe; leave as manual-tap only) |
| `'bigly'` | `'bigly'` |
| `'no collusion'` | `'no collusion'` |

---

### 2b. Hockey

```ts
{
  id: 'hockey',
  name: 'Hockey',
  description: 'Hat tricks, power plays, and going top shelf',
  icon: '🏒',
  words: [
    'hat trick', 'power play', 'penalty kill', 'face-off', 'slapshot',
    'wrist shot', 'breakaway', 'overtime', 'shootout', 'goal crease',
    'blue line', 'red line', 'offside', 'icing', 'penalty box',
    'sin bin', 'puck drop', 'chirp', 'boarding', 'high-sticking',
    'cross-checking', 'interference', 'hooking', 'tripping', 'delay of game',
    'empty net', 'short-handed', 'five-hole', 'top shelf', 'glove side',
    'dangle', 'deke', 'forecheck', 'backcheck', 'neutral zone',
    'dump and chase', 'cycle', 'board battle', 'odd-man rush', 'two-on-one',
    'Zamboni', 'tip in', 'rebound', 'goalie', 'five-on-three',
  ],
},
```

**Word alias additions**:

| Card word | Speech recognition variants |
|---|---|
| `'face-off'` | `'faceoff'` |
| `'slapshot'` | `'slap shot'` |
| `'high-sticking'` | `'high sticking'` |
| `'cross-checking'` | `'cross checking'` |
| `'short-handed'` | `'shorthanded'` |
| `'five-hole'` | `'five hole'` |
| `'five-on-three'` | `'five on three'` |
| `'two-on-one'` | `'two on one'` |
| `'odd-man rush'` | `'odd man rush'` |

---

### 2c. AI Talk

```ts
{
  id: 'ai-talk',
  name: 'AI Talk',
  description: 'LLMs, hallucinations, and vibe coding',
  icon: '🤖',
  words: [
    'hallucination', 'prompt', 'prompt engineering', 'fine-tuning', 'LLM',
    'RAG', 'embeddings', 'transformer', 'GPT', 'generative AI',
    'agentic', 'multi-agent', 'context window', 'token', 'inference',
    'training data', 'RLHF', 'alignment', 'guardrails', 'AI safety',
    'AGI', 'frontier model', 'multimodal', 'neural network', 'deep learning',
    'machine learning', 'zero-shot', 'few-shot', 'chain of thought', 'reasoning',
    'benchmark', 'red-teaming', 'foundation model', 'grounding', 'tool use',
    'system prompt', 'temperature', 'vibe coding', 'Claude', 'ChatGPT',
    'Copilot', 'AI-powered', 'model collapse', 'autonomous agent', 'diffusion model',
  ],
},
```

**Word alias additions**:

| Card word | Speech recognition variants |
|---|---|
| `'LLM'` | `'llm'`, `'large language model'` |
| `'RAG'` | `'rag'`, `'retrieval augmented generation'` |
| `'GPT'` | `'gpt'`, `'generative pre-trained transformer'` |
| `'AGI'` | `'agi'`, `'artificial general intelligence'` |
| `'RLHF'` | `'rlhf'`, `'reinforcement learning from human feedback'` |
| `'chain of thought'` | `'chain-of-thought'` |
| `'fine-tuning'` | `'fine tuning'`, `'finetuning'` |
| `'red-teaming'` | `'red teaming'` |
| `'AI-powered'` | `'ai powered'`, `'AI powered'` |
| `'multi-agent'` | `'multi agent'` |
| `'zero-shot'` | `'zero shot'` |
| `'few-shot'` | `'few shot'` |

---

## Step 3 — `WORD_ALIASES` in `wordDetector.ts`

Extend the existing `WORD_ALIASES` map with all entries from the tables above. Pattern: key is the canonical card word (lowercase), values are additional strings the speech API might produce.

```ts
// Trump aliases
'maga': ['make america great again'],
'no collusion': ['no collusion'],

// Hockey aliases
'face-off': ['faceoff'],
'slapshot': ['slap shot'],
'high-sticking': ['high sticking'],
'cross-checking': ['cross checking'],
'short-handed': ['shorthanded'],
'five-hole': ['five hole'],
'five-on-three': ['five on three'],
'two-on-one': ['two on one'],
'odd-man rush': ['odd man rush'],

// AI Talk aliases
'llm': ['large language model'],
'rag': ['retrieval augmented generation'],
'gpt': ['generative pre-trained transformer'],
'agi': ['artificial general intelligence'],
'rlhf': ['reinforcement learning from human feedback'],
'chain of thought': ['chain-of-thought'],
'fine-tuning': ['fine tuning', 'finetuning'],
'red-teaming': ['red teaming'],
'ai-powered': ['ai powered'],
'multi-agent': ['multi agent'],
'zero-shot': ['zero shot'],
'few-shot': ['few shot'],
```

---

## Verification Checklist

- [ ] `npm run typecheck` — no TypeScript errors after `CategoryId` update
- [ ] All three new categories appear on `CategorySelect` screen
- [ ] Each card generates a valid 5×5 grid (25 words drawn from 45+)
- [ ] Manual tap fills squares for all three themes
- [ ] Speech recognition: speak "hallucination" → AI Talk square fills
- [ ] Speech recognition: speak "hat trick" → Hockey square fills
- [ ] Speech recognition: speak "witch hunt" → Trump square fills
- [ ] Speech recognition: speak "large language model" → `LLM` square fills (alias check)
- [ ] `npm run build` — no build errors
