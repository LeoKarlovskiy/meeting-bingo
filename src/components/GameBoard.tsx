import { useCallback, useState } from 'react';
import { GameState, WinningLine } from '../types';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { GameControls } from './GameControls';
import { ToastContainer } from './ui/Toast';
import { Toast } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useGame } from '../hooks/useGame';
import { generateCard } from '../lib/cardGenerator';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { CATEGORIES } from '../data/categories';

interface Props {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: (line: WinningLine, word: string) => void;
}

export function GameBoard({ game, setGame, onWin }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [markedSquareId, setMarkedSquareId] = useState<string | null>(null);

  const { fillSquare, toggleSquare } = useGame(game, setGame, onWin);

  const addToast = useCallback((message: string) => {
    const id = String(Date.now() + Math.random());
    setToasts(prev => [...prev, { id, message, type: 'success' }]);
  }, []);

  const handleSpeechResult = useCallback((transcript: string) => {
    if (!game.card) return;
    const filledSet = new Set(
      game.card.squares.flat()
        .filter(sq => sq.isFilled)
        .map(sq => sq.word.toLowerCase()),
    );
    const found = detectWordsWithAliases(transcript, game.card.words, filledSet);
    for (const word of found) {
      const sq = game.card.squares.flat().find(s => s.word === word);
      if (sq && !sq.isFilled) {
        fillSquare(sq.id, word, true);
        addToast(`"${word}" detected!`);
        setDetectedWords(prev => [...prev, word]);
      }
    }
  }, [game.card, fillSquare, addToast]);

  const { isSupported, isListening, transcript, interimTranscript, startListening, stopListening } =
    useSpeechRecognition();

  const toggleListen = useCallback(() => {
    if (isListening) {
      stopListening();
      setGame(prev => ({ ...prev, isListening: false }));
    } else {
      startListening(handleSpeechResult);
      setGame(prev => ({ ...prev, isListening: true }));
    }
  }, [isListening, startListening, stopListening, handleSpeechResult, setGame]);

  const handleNewCard = useCallback(() => {
    if (!game.category) return;
    const card = generateCard(game.category);
    setGame(prev => ({
      ...prev,
      card,
      filledCount: 1,
      winningLine: null,
      winningWord: null,
      startedAt: Date.now(),
    }));
    setDetectedWords([]);
  }, [game.category, setGame]);

  const handleSquareClick = useCallback((squareId: string, _word: string) => {
    toggleSquare(squareId);
    setMarkedSquareId(squareId);
  }, [toggleSquare]);

  const category = CATEGORIES.find(c => c.id === game.category);
  const winningIds = new Set(game.winningLine?.squares ?? []);

  if (!game.card) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4 pt-2">
          <div>
            <span className="text-lg font-bold text-gray-900">{category?.icon} {category?.name}</span>
            <div className="text-xs text-gray-500">{game.filledCount}/25 squares filled</div>
          </div>
        </div>

        <BingoCard
          card={game.card}
          winningSquareIds={winningIds}
          onSquareClick={handleSquareClick}
          markedSquareId={markedSquareId}
        />

        <GameControls
          isListening={isListening}
          isSupported={isSupported}
          onToggleListen={toggleListen}
          onNewCard={handleNewCard}
        />

        {isListening && (
          <TranscriptPanel
            transcript={transcript}
            interimTranscript={interimTranscript}
            detectedWords={detectedWords}
            isListening={isListening}
          />
        )}

        {!isSupported && (
          <p className="text-xs text-gray-400 text-center mt-3">
            Speech recognition not supported in this browser. Tap squares manually.
          </p>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}
