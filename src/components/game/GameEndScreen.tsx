import { Trophy, RefreshCw, Star, TrendingUp, PiggyBank, AlertTriangle, ShoppingCart } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn, formatIndianCurrency } from '@/lib/utils';

interface GameEndScreenProps {
  gameState: GameState;
  result: {
    title: string;
    description: string;
    color: 'success' | 'warning' | 'destructive';
  };
  onRestart: () => void;
  onPurchaseGoal?: () => void;
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

export const GameEndScreen = ({ gameState, result, onRestart, onPurchaseGoal }: GameEndScreenProps) => {
  const canPurchaseGoal = gameState.selectedGoal && 
    gameState.savings >= gameState.selectedGoal.cost && 
    !gameState.goalAchieved;

  const lessons = [
    {
      condition: gameState.savings >= 200000,
      positive: true,
      text: 'Excellent savings! You built a strong financial cushion.',
    },
    {
      condition: gameState.savings < 100000,
      positive: false,
      text: 'Try to save more regularly to build emergency funds.',
    },
    {
      condition: gameState.monthlyIncome > 150000,
      positive: true,
      text: 'Your consistent saving unlocked income growth!',
    },
    {
      condition: gameState.debt === 0 && gameState.monthHistory.some(m => m.event?.type === 'loan_offer'),
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
    {
      condition: gameState.propertyConfiscated,
      positive: false,
      text: 'Always repay loans within 6 months to avoid losing your property.',
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

        {/* Purchase Goal Button */}
        {canPurchaseGoal && onPurchaseGoal && (
          <button
            onClick={onPurchaseGoal}
            className="btn-primary-game w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500"
          >
            <ShoppingCart className="w-5 h-5" />
            Buy {gameState.selectedGoal?.name} {gameState.selectedGoal?.emoji}
          </button>
        )}

        {/* Final Stats */}
        <div className="game-card">
          <h2 className="font-bold text-lg mb-4 text-center text-foreground">Final Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-amber-50">
              <PiggyBank className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-amber-700">{formatIndianCurrency(gameState.savings)}</div>
              <div className="text-xs text-amber-600">Total Savings</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-emerald-700">{formatIndianCurrency(gameState.monthlyIncome)}</div>
              <div className="text-xs text-emerald-600">Final Income</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50">
              <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-700">{gameState.stabilityScore}/100</div>
              <div className="text-xs text-blue-600">Stability Score</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-red-700">{formatIndianCurrency(gameState.debt)}</div>
              <div className="text-xs text-red-600">Remaining Debt</div>
            </div>
          </div>
        </div>

        {/* Lessons Learned */}
        {lessons.length > 0 && (
          <div className="game-card">
            <h2 className="font-bold text-lg mb-4 text-foreground">What You Learned</h2>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
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
