# Implementation Plan: "Marked!" Square Popup

## Goal

Show a small "marked!" popup on a bingo square when clicked. The popup disappears when a different square is clicked (replaced by the new square's popup). Only one popup is visible at a time.

## Current Behavior

`handleSquareClick` in `GameBoard.tsx:76-79` calls `addToast(`"${word}" marked!`")` which pushes a new entry to the `toasts` array. Multiple toasts can stack up at the bottom of the screen and auto-dismiss after 2500ms each.

## Target Behavior

- Click square → small "✅ marked!" badge floats above that square
- Click a different square → previous badge disappears, new badge appears on the new square
- The "detected!" toast for speech recognition is **unchanged**

---

## Changes Required

### 1. `src/components/GameBoard.tsx`

- Add state: `const [markedSquareId, setMarkedSquareId] = useState<string | null>(null)`
- Update `handleSquareClick` to set `markedSquareId` instead of calling `addToast`:
  ```ts
  const handleSquareClick = useCallback((squareId: string, word: string) => {
    toggleSquare(squareId);
    setMarkedSquareId(squareId);
  }, [toggleSquare]);
  ```
- Pass `markedSquareId` to `<BingoCard>`:
  ```tsx
  <BingoCard
    card={game.card}
    winningSquareIds={winningIds}
    onSquareClick={handleSquareClick}
    markedSquareId={markedSquareId}
  />
  ```
- The `addToast` helper and `toasts` state remain — still used for speech "detected!" notifications.

### 2. `src/components/BingoCard.tsx`

- Add `markedSquareId?: string | null` to the `Props` interface
- Thread it down to each `<BingoSquare>`:
  ```tsx
  <BingoSquare
    key={square.id}
    square={square}
    isWinningSquare={winningSquareIds.has(square.id)}
    isMarked={square.id === markedSquareId}
    onClick={() => onSquareClick(square.id, square.word)}
  />
  ```

### 3. `src/components/BingoSquare.tsx`

- Add `isMarked?: boolean` to the `Props` interface
- Wrap the existing `<button>` in a `<div className="relative">` container
- Render a conditionally visible badge positioned above the button:
  ```tsx
  <div className="relative">
    {isMarked && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      bg-green-500 text-white shadow-md whitespace-nowrap
                      animate-bounce-in pointer-events-none">
        ✅ marked!
      </div>
    )}
    <button ...>
      ...
    </button>
  </div>
  ```

#### Animation

Add a simple scale-in animation to `tailwind.config.ts` (or inline via a `@keyframes` in `index.css`):

```css
@keyframes bounce-in {
  0%   { opacity: 0; transform: translateX(-50%) scale(0.7); }
  60%  { transform: translateX(-50%) scale(1.1); }
  100% { opacity: 1; transform: translateX(-50%) scale(1); }
}
.animate-bounce-in {
  animation: bounce-in 0.2s ease-out forwards;
}
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/GameBoard.tsx` | Add `markedSquareId` state; update `handleSquareClick`; pass prop to `BingoCard` |
| `src/components/BingoCard.tsx` | Accept + pass `markedSquareId` prop to each `BingoSquare` |
| `src/components/BingoSquare.tsx` | Accept `isMarked` prop; render badge overlay |
| `src/index.css` | Add `@keyframes bounce-in` and `.animate-bounce-in` class |

---

## Non-Goals

- No changes to the speech "detected!" toast flow
- No auto-dismiss timer on the popup (disappears only on next click)
- No changes to the win screen
