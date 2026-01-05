import { SavingGoal } from '@/types/game';
import { ProgressBar } from './ProgressBar';

interface GoalCardProps {
  goal: SavingGoal;
  currentSavings: number;
  year: number;
}

export const GoalCard = ({ goal, currentSavings, year }: GoalCardProps) => {
  const progress = Math.min(100, (currentSavings / goal.targetAmount) * 100);
  const isComplete = currentSavings >= goal.targetAmount;

  return (
    <div className={`game-card border-2 ${isComplete ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50' : 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{goal.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground">Year {year} Goal</h3>
            {isComplete && <span className="text-emerald-600 text-sm font-bold">✓ Complete!</span>}
          </div>
          <p className="text-sm text-muted-foreground">{goal.name}: {goal.description}</p>
        </div>
      </div>
      
      <ProgressBar
        value={currentSavings}
        max={goal.targetAmount}
        label={`₹${currentSavings.toLocaleString()} / ₹${goal.targetAmount.toLocaleString()}`}
        variant={isComplete ? 'stability' : 'savings'}
      />
      
      {!isComplete && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ₹{(goal.targetAmount - currentSavings).toLocaleString()} more to reach your goal!
        </p>
      )}
    </div>
  );
};
