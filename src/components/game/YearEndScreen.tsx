import { Trophy, ArrowRight, RefreshCw, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { GameState, SAVING_GOALS } from '@/types/game';
import { cn } from '@/lib/utils';

interface YearEndScreenProps {
  gameState: GameState;
  onContinueNextYear: () => void;
  onRestart: () => void;
}

export const YearEndScreen = ({ gameState, onContinueNextYear, onRestart }: YearEndScreenProps) => {
  const goalCompleted = gameState.currentGoal ? gameState.savings >= gameState.currentGoal.targetAmount : false;
  
  // Check if there are more goals
  const completedGoalIds = goalCompleted && gameState.currentGoal 
    ? [...gameState.completedGoals, gameState.currentGoal.id]
    : gameState.completedGoals;
  const nextGoal = SAVING_GOALS.find(g => !completedGoalIds.includes(g.id));
  const hasMoreGoals = !!nextGoal;

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 animate-slide-up">
        {/* Year Complete Header */}
        <div className={cn(
          'game-card border-2 text-center bg-gradient-to-br',
          goalCompleted 
            ? 'from-emerald-100 to-green-50 border-emerald-300'
            : 'from-amber-100 to-yellow-50 border-amber-300'
        )}>
          <div className="text-5xl mb-3">{goalCompleted ? '🎉' : '📅'}</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Year {gameState.year} Complete!
          </h1>
          {goalCompleted ? (
            <p className="text-emerald-700">
              Congratulations! You achieved your goal: {gameState.currentGoal?.name}!
            </p>
          ) : (
            <p className="text-amber-700">
              You didn't reach the goal this year. Keep trying!
            </p>
          )}
        </div>

        {/* Goal Progress */}
        {gameState.currentGoal && (
          <div className="game-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{gameState.currentGoal.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{gameState.currentGoal.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Target: ₹{gameState.currentGoal.targetAmount.toLocaleString()}
                </p>
              </div>
              {goalCompleted ? (
                <span className="text-emerald-600 font-bold">✓ Done!</span>
              ) : (
                <span className="text-amber-600 font-bold">
                  {Math.round((gameState.savings / gameState.currentGoal.targetAmount) * 100)}%
                </span>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={cn(
                  "h-3 rounded-full transition-all duration-500",
                  goalCompleted ? "bg-emerald-500" : "bg-amber-500"
                )}
                style={{ width: `${Math.min(100, (gameState.savings / gameState.currentGoal.targetAmount) * 100)}%` }}
              />
            </div>
            <p className="text-center text-sm mt-2 text-muted-foreground">
              Your savings: ₹{gameState.savings.toLocaleString()}
            </p>
          </div>
        )}

        {/* Year Stats */}
        <div className="game-card">
          <h2 className="font-bold text-lg mb-4 text-center text-foreground">Year {gameState.year} Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-700">{gameState.stabilityScore}/100</div>
              <div className="text-xs text-blue-600">Stability Score</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-emerald-700">₹{gameState.monthlyIncome.toLocaleString()}</div>
              <div className="text-xs text-emerald-600">Final Income</div>
            </div>
          </div>
          {gameState.debt > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm">
                Debt carries over: ₹{gameState.debt.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Next Year Preview */}
        {hasMoreGoals && nextGoal && (
          <div className="game-card border-2 border-primary/30 bg-primary/5">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <span className="text-xl">🎯</span> Next Year Challenge
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextGoal.icon}</span>
              <div>
                <p className="font-semibold text-foreground">{nextGoal.name}</p>
                <p className="text-sm text-muted-foreground">
                  Save ₹{nextGoal.targetAmount.toLocaleString()} • Difficulty +15%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {gameState.completedGoals.length > 0 && (
          <div className="game-card">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Goals Achieved
            </h3>
            <div className="flex flex-wrap gap-2">
              {gameState.completedGoals.map(goalId => {
                const goal = SAVING_GOALS.find(g => g.id === goalId);
                return goal ? (
                  <span key={goalId} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-1">
                    {goal.icon} {goal.name}
                  </span>
                ) : null;
              })}
              {goalCompleted && gameState.currentGoal && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-1">
                  {gameState.currentGoal.icon} {gameState.currentGoal.name}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {hasMoreGoals ? (
            <button
              onClick={onContinueNextYear}
              className="btn-primary-game w-full flex items-center justify-center gap-2"
            >
              Continue to Year {gameState.year + 1}
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="text-center game-card bg-gradient-to-br from-amber-100 to-yellow-50 border-amber-300">
              <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-2" />
              <h3 className="font-bold text-foreground">All Goals Complete!</h3>
              <p className="text-sm text-muted-foreground">You've mastered farmer finances!</p>
            </div>
          )}
          <button
            onClick={onRestart}
            className="btn-secondary-game w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};
