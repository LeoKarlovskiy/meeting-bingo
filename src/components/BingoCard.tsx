import { BingoCard as BingoCardType } from '../types';
import { BingoSquare } from './BingoSquare';

interface Props {
  card: BingoCardType;
  winningSquareIds: Set<string>;
  onSquareClick: (squareId: string, word: string) => void;
  markedSquareId?: string | null;
}

const HEADERS = ['B', 'I', 'N', 'G', 'O'];

export function BingoCard({ card, winningSquareIds, onSquareClick, markedSquareId }: Props) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-5 gap-1 mb-1">
        {HEADERS.map(h => (
          <div key={h} className="text-center font-bold text-blue-600 text-lg py-1">
            {h}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {card.squares.flat().map(square => (
          <BingoSquare
            key={square.id}
            square={square}
            isWinningSquare={winningSquareIds.has(square.id)}
            isMarked={square.id === markedSquareId}
            onClick={() => onSquareClick(square.id, square.word)}
          />
        ))}
      </div>
    </div>
  );
}
