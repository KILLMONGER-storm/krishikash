import { Sprout, Target, TrendingUp, Shield } from 'lucide-react';
import { DifficultyLevel, DIFFICULTY_LEVELS } from '@/types/game';
import { formatIndianCurrency } from '@/lib/utils';

interface IntroScreenProps {
  onStart: (difficulty: DifficultyLevel) => void;
}

export const IntroScreen = ({ onStart }: IntroScreenProps) => {
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
            A 12-Month Farmer Finance Game
          </p>
        </div>

        {/* Game Description */}
        <div className="game-card text-left">
          <h2 className="font-bold text-lg mb-4 text-center text-foreground">How to Play</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Manage 12 Months</p>
                <p className="text-sm text-muted-foreground">Make smart financial decisions each month</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Save & Grow</p>
                <p className="text-sm text-muted-foreground">Regular saving unlocks income bonuses</p>
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

        {/* Difficulty Selection */}
        <div className="game-card text-left">
          <h2 className="font-bold text-lg mb-4 text-center text-foreground">Choose Difficulty</h2>
          <div className="space-y-3">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onStart(level.id)}
                className="w-full p-4 rounded-xl border-2 border-border hover:border-primary transition-all bg-card hover:bg-accent/50 text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{level.name}</p>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                    <p className="text-xs text-primary mt-1">Income: {formatIndianCurrency(level.monthlyIncome)}/month</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Starting Stats */}
        <div className="game-card bg-secondary/50">
          <p className="text-sm font-semibold text-foreground mb-2">You'll start with:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Starting Stability:</div>
            <div className="font-bold text-blue-600">55/100</div>
          </div>
        </div>
      </div>
    </div>
  );
};
