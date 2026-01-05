import { Sprout, RotateCcw } from 'lucide-react';

interface GameHeaderProps {
  month: number;
  year: number;
  onReset: () => void;
}

export const GameHeader = ({ month, year, onReset }: GameHeaderProps) => {
  return (
    <header className="flex items-center justify-between py-4 px-2 border-b border-border mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Sprout className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-foreground">KrishiCash</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Year {year} • Month {month}/12
        </span>
        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Restart Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
