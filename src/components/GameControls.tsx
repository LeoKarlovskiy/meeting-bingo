import { Button } from './ui/Button';

interface Props {
  isListening: boolean;
  isSupported: boolean;
  onToggleListen: () => void;
  onNewCard: () => void;
}

export function GameControls({ isListening, isSupported, onToggleListen, onNewCard }: Props) {
  return (
    <div className="flex gap-2 mt-4">
      {isSupported && (
        <Button
          variant={isListening ? 'secondary' : 'primary'}
          onClick={onToggleListen}
          className="flex-1"
        >
          {isListening ? '⏹ Stop Mic' : '🎤 Start Mic'}
        </Button>
      )}
      <Button variant="secondary" onClick={onNewCard} size="md">
        🔄 New Card
      </Button>
    </div>
  );
}
