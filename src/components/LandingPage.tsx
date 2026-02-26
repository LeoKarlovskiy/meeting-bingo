import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Meeting Bingo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Turn corporate buzzwords into a game. Auto-detect words via your mic, or tap them yourself.
        </p>

        <Button size="lg" onClick={onStart} className="w-full mb-6">
          New Game
        </Button>

        <div className="bg-white rounded-xl p-5 text-left shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">How it works</h2>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span> Pick a buzzword category</li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span> Enable your mic or tap squares manually</li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span> Get 5 in a row to win</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
