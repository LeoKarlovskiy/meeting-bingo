import { useState, useCallback } from 'react';
import { GameState, CategoryId, WinningLine } from './types';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { generateCard } from './lib/cardGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';

type Screen = 'landing' | 'category' | 'game' | 'win';

const INITIAL_GAME: GameState = {
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

export default function App() {
  const [game, setGame] = useLocalStorage<GameState>('meeting-bingo-game', INITIAL_GAME);

  // Derive screen from game status; default to landing
  const deriveScreen = (g: GameState): Screen => {
    if (g.status === 'won') return 'win';
    if (g.status === 'playing') return 'game';
    if (g.status === 'setup') return 'category';
    return 'landing';
  };

  const [screen, setScreen] = useState<Screen>(() => {
    // Resume a playing game; otherwise start fresh
    return game.status === 'playing' ? 'game' : 'landing';
  });

  const handleStart = useCallback(() => {
    setGame(prev => ({ ...prev, status: 'setup' }));
    setScreen('category');
  }, [setGame]);

  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1,
    });
    setScreen('game');
  }, [setGame]);

  const handleWin = useCallback((winningLine: WinningLine, winningWord: string) => {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine,
      winningWord,
    }));
    setScreen('win');
  }, [setGame]);

  const handlePlayAgain = useCallback(() => {
    setGame(prev => ({ ...prev, status: 'setup' }));
    setScreen('category');
  }, [setGame]);

  const handleHome = useCallback(() => {
    setGame(INITIAL_GAME);
    setScreen('landing');
  }, [setGame]);

  // Use derived screen as fallback in case of stale state
  const activeScreen = screen === deriveScreen(game) ? screen : deriveScreen(game);

  return (
    <div className="min-h-screen bg-gray-50">
      {activeScreen === 'landing' && <LandingPage onStart={handleStart} />}
      {activeScreen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleHome} />
      )}
      {activeScreen === 'game' && game.card && (
        <GameBoard game={game} setGame={setGame} onWin={handleWin} />
      )}
      {activeScreen === 'win' && (
        <WinScreen game={game} onPlayAgain={handlePlayAgain} onHome={handleHome} />
      )}
    </div>
  );
}
