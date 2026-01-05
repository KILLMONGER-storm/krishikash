import { Sprout, Target, TrendingUp, Shield } from 'lucide-react';
import { SavingGoal } from '@/types/game';

interface IntroScreenProps {
  onStart: () => void;
  currentGoal: SavingGoal | null;
}

export const IntroScreen = ({ onStart, currentGoal }: IntroScreenProps) => {
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-slide-up">
        {/* Logo/Title */}
        <div className="space-y-2">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
            <Sprout className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground">
            KrishiCash
          </h1>
          <p className="text-lg text-muted-foreground">
            A Multi-Year Farmer Finance Journey
          </p>
        </div>

        {/* First Year Goal */}
        {currentGoal && (
          <div className="game-card border-2 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{currentGoal.icon}</span>
              <div className="text-left">
                <h3 className="font-bold text-foreground">Year 1 Goal</h3>
                <p className="text-primary font-semibold">{currentGoal.name}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{currentGoal.description}</p>
            <div className="mt-3 p-2 bg-primary/10 rounded-lg">
              <p className="text-sm font-bold text-primary">
                Target: ₹{currentGoal.targetAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Game Description */}
        <div className="game-card text-left">
          <h2 className="font-bold text-lg mb-4 text-center text-foreground">How to Play</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Complete 12 Months</p>
                <p className="text-sm text-muted-foreground">Make smart decisions to reach your yearly goal</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Progress Through Years</p>
                <p className="text-sm text-muted-foreground">Each year brings bigger goals & challenges</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Stay Protected</p>
                <p className="text-sm text-muted-foreground">Insurance helps when life gets tough</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Game */}
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="btn-primary-game w-full text-lg py-4"
          >
            Start Year 1 🌾
          </button>
          <p className="text-xs text-muted-foreground">
            Can you complete all 6 goals and become a Master Farmer?
          </p>
        </div>

        {/* Starting Stats */}
        <div className="game-card bg-secondary/50">
          <p className="text-sm font-semibold text-foreground mb-2">You'll start with:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Monthly Income:</div>
            <div className="font-bold text-primary">₹12,000</div>
            <div className="text-muted-foreground">Starting Stability:</div>
            <div className="font-bold text-blue-600">70/100</div>
          </div>
        </div>
      </div>
    </div>
  );
};
