import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import { Button } from './ui/Button';
import { CATEGORIES } from '../data/categories';
import { shareResult } from '../lib/shareUtils';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES.find(c => c.id === game.category);

  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }, []);

  const elapsed = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000)
    : null;
  const timeStr = elapsed != null
    ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
    : '—';

  const handleShare = async () => {
    await shareResult(game);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-4xl font-bold text-green-800 mb-2">BINGO!</h1>
        <p className="text-gray-600 mb-6">
          You got it{game.winningWord ? ` with "${game.winningWord}"` : ''}!
        </p>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category</span>
            <span className="font-medium">{category?.icon} {category?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">⏱ {timeStr}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Squares filled</span>
            <span className="font-medium">{game.filledCount}/25</span>
          </div>
          {game.winningLine && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Winning line</span>
              <span className="font-medium capitalize">
                {game.winningLine.type} {game.winningLine.type !== 'diagonal' ? game.winningLine.index + 1 : ''}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button size="lg" onClick={handleShare} className="w-full">
            {copied ? '✅ Copied!' : '📤 Share Result'}
          </Button>
          <Button size="lg" variant="secondary" onClick={onPlayAgain} className="w-full">
            🔄 Play Again
          </Button>
          <Button size="md" variant="ghost" onClick={onHome} className="w-full">
            ← Home
          </Button>
        </div>
      </div>
    </div>
  );
}
