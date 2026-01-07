import { GameGoal, GAME_GOALS } from '@/types/game';
import { Target } from 'lucide-react';

interface GoalSelectionScreenProps {
  onSelectGoal: (goal: GameGoal) => void;
}

export const GoalSelectionScreen = ({ onSelectGoal }: GoalSelectionScreenProps) => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 animate-slide-up">
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Choose Your Goal
          </h1>
          <p className="text-muted-foreground">
            What do you want to save for over the next 12 months?
          </p>
        </div>

        <div className="space-y-3">
          {GAME_GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => onSelectGoal(goal)}
              className="game-card w-full text-left hover:border-primary transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{goal.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {goal.name}
                  </h3>
                  <p className="text-lg font-semibold text-primary">
                    ₹{goal.cost.toLocaleString()}
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Save enough to buy your chosen item before the year ends!
          <br />
          <span className="text-primary font-medium">
            Bonus: Item value increases by 10% after purchase!
          </span>
        </p>
      </div>
    </div>
  );
};
