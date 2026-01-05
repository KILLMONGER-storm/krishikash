import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { GameState } from '@/types/game';

interface MonthSummaryProps {
  gameState: GameState;
  onContinue: () => void;
}

export const MonthSummary = ({ gameState, onContinue }: MonthSummaryProps) => {
  const lastRecord = gameState.monthHistory[gameState.monthHistory.length - 1];
  const prevRecord = gameState.monthHistory[gameState.monthHistory.length - 2];

  const balanceChange = prevRecord 
    ? lastRecord.balance - prevRecord.balance 
    : lastRecord.balance;

  const savingsChange = prevRecord 
    ? lastRecord.savings - prevRecord.savings 
    : lastRecord.savings;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <div className="text-5xl mb-2">📊</div>
        <h2 className="text-2xl font-bold text-foreground">
          Month {lastRecord?.month || gameState.month - 1} Complete!
        </h2>
        <p className="text-muted-foreground">Here's how you did</p>
      </div>

      {/* Summary Card */}
      <div className="game-card">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Balance Change</span>
            <span className={`flex items-center gap-1 font-bold ${balanceChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {balanceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {balanceChange >= 0 ? '+' : ''}₹{balanceChange.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Savings Change</span>
            <span className={`flex items-center gap-1 font-bold ${savingsChange >= 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {savingsChange > 0 && <TrendingUp className="w-4 h-4" />}
              {savingsChange > 0 ? '+' : ''}₹{savingsChange.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Balance</span>
            <span className="font-bold text-foreground">₹{gameState.balance.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Savings</span>
            <span className="font-bold text-emerald-600">₹{gameState.savings.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Stability Score</span>
            <span className="font-bold text-blue-600">{gameState.stabilityScore}/100</span>
          </div>
        </div>
      </div>

      {/* Event Recap */}
      {lastRecord?.event && (
        <div className="game-card bg-secondary/50">
          <p className="text-sm text-muted-foreground mb-1">This month's event:</p>
          <p className="font-semibold text-foreground">{lastRecord.event.title}</p>
        </div>
      )}

      {/* Tips */}
      <div className="game-card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <p className="text-sm font-semibold text-amber-800 mb-2">💡 Tip</p>
        <p className="text-sm text-amber-700">
          {gameState.savings < 5000 && 'Try to save at least ₹2,000 each month to unlock income bonuses!'}
          {gameState.savings >= 5000 && gameState.savings < 10000 && 'Great savings! Keep going to reach ₹10,000 for extra stability.'}
          {gameState.savings >= 10000 && 'Excellent savings! You\'re building a strong financial cushion.'}
          {gameState.debt > 0 && ' Remember to pay off your debt to improve your stability score.'}
        </p>
      </div>

      <button
        onClick={onContinue}
        className="btn-primary-game w-full flex items-center justify-center gap-2"
      >
        Continue to Month {gameState.month} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
