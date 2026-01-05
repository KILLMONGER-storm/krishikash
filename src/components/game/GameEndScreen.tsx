import { Trophy, RefreshCw, Star, TrendingUp, PiggyBank, AlertTriangle } from 'lucide-react';
import { GameState, SAVING_GOALS } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameEndScreenProps {
  gameState: GameState;
  result: {
    title: string;
    description: string;
    color: 'success' | 'warning' | 'destructive';
  };
  onRestart: () => void;
}

const colorStyles = {
  success: 'from-emerald-100 to-green-50 border-emerald-300',
  warning: 'from-amber-100 to-yellow-50 border-amber-300',
  destructive: 'from-red-100 to-rose-50 border-red-300',
};

const iconColors = {
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  destructive: 'text-red-600',
};

export const GameEndScreen = ({ gameState, result, onRestart }: GameEndScreenProps) => {
  const totalYears = gameState.yearHistory.length + 1;
  
  const lessons = [
    {
      condition: gameState.completedGoals.length >= 3,
      positive: true,
      text: `Amazing! You completed ${gameState.completedGoals.length} major goals!`,
    },
    {
      condition: gameState.savings >= 10000,
      positive: true,
      text: 'Excellent savings! You built a strong financial cushion.',
    },
    {
      condition: gameState.savings < 5000 && gameState.completedGoals.length === 0,
      positive: false,
      text: 'Try to save more regularly to build emergency funds.',
    },
    {
      condition: gameState.monthlyIncome > 15000,
      positive: true,
      text: 'Your consistent saving unlocked significant income growth!',
    },
    {
      condition: gameState.debt === 0,
      positive: true,
      text: 'You avoided or paid off debt - excellent discipline!',
    },
    {
      condition: gameState.debt > 0,
      positive: false,
      text: 'High-interest loans hurt your finances. Avoid when possible.',
    },
    {
      condition: gameState.stabilityScore >= 80,
      positive: true,
      text: 'You maintained excellent financial stability throughout!',
    },
  ].filter(l => l.condition);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 animate-slide-up">
        {/* Result Header */}
        <div className={cn(
          'game-card border-2 text-center bg-gradient-to-br',
          colorStyles[result.color]
        )}>
          <Trophy className={cn('w-16 h-16 mx-auto mb-4', iconColors[result.color])} />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {result.title}
          </h1>
          <p className="text-muted-foreground">
            {result.description}
          </p>
        </div>

        {/* Completed Goals */}
        {gameState.completedGoals.length > 0 && (
          <div className="game-card">
            <h2 className="font-bold text-lg mb-4 text-center text-foreground flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Goals Achieved
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {gameState.completedGoals.map(goalId => {
                const goal = SAVING_GOALS.find(g => g.id === goalId);
                return goal ? (
                  <span key={goalId} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-1">
                    {goal.icon} {goal.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Final Stats */}
        <div className="game-card">
          <h2 className="font-bold text-lg mb-4 text-center text-foreground">Final Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-purple-50">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-xl font-bold text-purple-700">{totalYears}</div>
              <div className="text-xs text-purple-600">Years Played</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-amber-50">
              <PiggyBank className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-amber-700">₹{gameState.savings.toLocaleString()}</div>
              <div className="text-xs text-amber-600">Final Savings</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-emerald-700">₹{gameState.monthlyIncome.toLocaleString()}</div>
              <div className="text-xs text-emerald-600">Final Income</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50">
              <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-700">{gameState.stabilityScore}/100</div>
              <div className="text-xs text-blue-600">Stability Score</div>
            </div>
          </div>
          {gameState.debt > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm font-medium">
                Remaining Debt: ₹{gameState.debt.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Year History */}
        {gameState.yearHistory.length > 0 && (
          <div className="game-card">
            <h2 className="font-bold text-lg mb-4 text-foreground">Year by Year</h2>
            <div className="space-y-2">
              {gameState.yearHistory.map((record) => (
                <div key={record.year} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Year {record.year}</span>
                    {record.goalCompleted && <span className="text-emerald-600">✓</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.goalName} • ₹{record.finalSavings.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Learned */}
        {lessons.length > 0 && (
          <div className="game-card">
            <h2 className="font-bold text-lg mb-4 text-foreground">What You Learned</h2>
            <div className="space-y-3">
              {lessons.slice(0, 4).map((lesson, index) => (
                <div 
                  key={index}
                  className={cn(
                    'flex gap-3 p-3 rounded-xl',
                    lesson.positive ? 'bg-emerald-50' : 'bg-amber-50'
                  )}
                >
                  <span className="text-xl">{lesson.positive ? '✅' : '💡'}</span>
                  <p className={cn(
                    'text-sm',
                    lesson.positive ? 'text-emerald-700' : 'text-amber-700'
                  )}>
                    {lesson.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Play Again */}
        <button
          onClick={onRestart}
          className="btn-primary-game w-full flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};
