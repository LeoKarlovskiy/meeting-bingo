import { GameState } from '../types';
import { CATEGORIES } from '../data/categories';

export function buildShareText(game: GameState): string {
  const category = CATEGORIES.find(c => c.id === game.category);
  const elapsed = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000)
    : null;
  const minutes = elapsed ? Math.floor(elapsed / 60) : null;
  const seconds = elapsed ? elapsed % 60 : null;
  const timeStr = minutes != null && seconds != null
    ? `${minutes}m ${seconds}s`
    : 'unknown time';

  return [
    '🎉 BINGO! I won Meeting Bingo!',
    category ? `📋 Category: ${category.name}` : '',
    game.winningWord ? `🏆 Winning word: "${game.winningWord}"` : '',
    `⏱️ Time: ${timeStr}`,
    `✅ Squares filled: ${game.filledCount}/25`,
    '',
    'Play at: meetingbingo.vercel.app',
  ].filter(Boolean).join('\n');
}

export async function shareResult(game: GameState): Promise<void> {
  const text = buildShareText(game);

  if (navigator.share) {
    await navigator.share({ title: 'Meeting Bingo', text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}
