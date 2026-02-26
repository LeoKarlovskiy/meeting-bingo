import { useCallback } from 'react';
import { GameState, BingoCard, WinningLine } from '../types';
import { checkForBingo, countFilled } from '../lib/bingoChecker';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame(
  _game: GameState,
  setGame: React.Dispatch<React.SetStateAction<GameState>>,
  onWin: (line: WinningLine, word: string) => void,
) {
  const fillSquare = useCallback((squareId: string, word: string, isAuto: boolean) => {
    setGame(prev => {
      if (!prev.card) return prev;
      const newSquares = prev.card.squares.map(row =>
        row.map(sq =>
          sq.id === squareId && !sq.isFilled
            ? { ...sq, isFilled: true, isAutoFilled: isAuto, filledAt: Date.now() }
            : sq,
        ),
      );
      const newCard: BingoCard = { ...prev.card, squares: newSquares };
      const winLine = checkForBingo(newCard);
      if (winLine) {
        onWin(winLine, word);
        return {
          ...prev,
          card: newCard,
          filledCount: countFilled(newCard),
          status: 'won',
          completedAt: Date.now(),
          winningLine: winLine,
          winningWord: word,
        };
      }
      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, [setGame, onWin]);

  const toggleSquare = useCallback((squareId: string) => {
    setGame(prev => {
      if (!prev.card) return prev;
      const newSquares = prev.card.squares.map(row =>
        row.map(sq =>
          sq.id === squareId && !sq.isFreeSpace
            ? { ...sq, isFilled: !sq.isFilled, isAutoFilled: false, filledAt: sq.isFilled ? null : Date.now() }
            : sq,
        ),
      );
      const newCard: BingoCard = { ...prev.card, squares: newSquares };
      const sq = newCard.squares.flat().find(s => s.id === squareId);
      if (sq?.isFilled) {
        const winLine = checkForBingo(newCard);
        if (winLine) {
          onWin(winLine, sq.word);
          return {
            ...prev,
            card: newCard,
            filledCount: countFilled(newCard),
            status: 'won',
            completedAt: Date.now(),
            winningLine: winLine,
            winningWord: sq.word,
          };
        }
      }
      return { ...prev, card: newCard, filledCount: countFilled(newCard) };
    });
  }, [setGame, onWin]);

  const resetGame = useCallback(() => {
    setGame(INITIAL_STATE);
  }, [setGame]);

  return { fillSquare, toggleSquare, resetGame, INITIAL_STATE };
}
