import { Sprout, RotateCcw, Target } from 'lucide-react';
import { GameGoal } from '@/types/game';

interface GameHeaderProps {
  month: number;
  onReset: () => void;
  selectedGoal?: GameGoal | null;
  savings?: number;
}

export const GameHeader = ({ month, onReset, selectedGoal, savings = 0 }: GameHeaderProps) => {
  const progress = selectedGoal ? Math.min(100, (savings / selectedGoal.cost) * 100) : 0;
  
  return (
    <header className="py-4 px-2 border-b border-border mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sprout className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">KrishiCash</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-muted-foreground">
            Month {month}/12
          </span>
          <button
            onClick={onReset}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {selectedGoal && (
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Goal:</span>
          <span className="text-xs font-semibold">{selectedGoal.emoji} {selectedGoal.name}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
        </div>
      )}
    </header>
  );
};
