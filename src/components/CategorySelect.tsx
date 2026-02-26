import { CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';

interface Props {
  onSelect: (id: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Category</h2>
        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="w-full bg-white rounded-xl p-4 text-left border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{cat.name}</div>
                  <div className="text-sm text-gray-500">{cat.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Sample: {cat.words.slice(0, 3).join(', ')}…
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
