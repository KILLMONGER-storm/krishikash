import { Wallet, PiggyBank, TrendingUp, Heart, AlertTriangle } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProgressBar } from './ProgressBar';
import { MonthIndicator } from './MonthIndicator';
import { GameState, FIXED_EXPENSES } from '@/types/game';
import { formatIndianCurrency } from '@/lib/utils';

interface DashboardProps {
  gameState: GameState;
  onStartMonth: () => void;
}

export const Dashboard = ({ gameState, onStartMonth }: DashboardProps) => {
  const householdExpenses = Math.round(FIXED_EXPENSES.household * gameState.expenseMultiplier);
  const farmingExpenses = Math.round(FIXED_EXPENSES.farming * gameState.expenseMultiplier);
  const educationExpenses = Math.round(FIXED_EXPENSES.education * gameState.expenseMultiplier);
  const totalExpenses = householdExpenses + farmingExpenses + educationExpenses;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Month Progress */}
      <MonthIndicator currentMonth={gameState.month} />

      {/* Stability Score */}
      <div className="game-card">
        <ProgressBar
          value={gameState.stabilityScore}
          max={100}
          label="Financial Stability"
          variant="stability"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {gameState.stabilityScore > 80 && '🌟 Excellent! Keep it up!'}
          {gameState.stabilityScore > 50 && gameState.stabilityScore <= 80 && '📊 Stable. Room for improvement.'}
          {gameState.stabilityScore <= 50 && '⚠️ Needs attention. Try saving more.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          label="Balance"
          value={gameState.balance}
          icon={<Wallet className="w-6 h-6" />}
          variant="money"
        />
        <StatsCard
          label="Savings"
          value={gameState.savings}
          icon={<PiggyBank className="w-6 h-6" />}
          variant="savings"
        />
        <StatsCard
          label="Income"
          value={gameState.monthlyIncome}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="default"
        />
        <StatsCard
          label="Debt"
          value={gameState.debt}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="debt"
        />
      </div>

      {/* Monthly Breakdown */}
      <div className="game-card">
        <h3 className="font-bold text-foreground mb-3">Monthly Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Household Expenses</span>
            <span className="font-semibold text-foreground">{formatIndianCurrency(householdExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Farming Costs</span>
            <span className="font-semibold text-foreground">{formatIndianCurrency(farmingExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Education</span>
            <span className="font-semibold text-foreground">{formatIndianCurrency(educationExpenses)}</span>
          </div>
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total Expenses</span>
              <span className="text-red-600">{formatIndianCurrency(totalExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Status */}
      {gameState.hasInsurance && (
        <div className="game-card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-blue-600" />
            <div>
              <span className="font-bold text-blue-700">Insurance Active</span>
              <p className="text-xs text-blue-600">Protected against crop loss this month</p>
            </div>
          </div>
        </div>
      )}

      {/* Consecutive Savings Tracker */}
      {gameState.consecutiveSavingMonths > 0 && (
        <div className="game-card bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <span className="font-bold text-emerald-700">Savings Streak!</span>
              <p className="text-xs text-emerald-600">
                {gameState.consecutiveSavingMonths} month{gameState.consecutiveSavingMonths > 1 ? 's' : ''} saved | 
                {formatIndianCurrency(gameState.totalSavedThisStreak)} total
              </p>
              {gameState.consecutiveSavingMonths >= 3 && gameState.totalSavedThisStreak >= 75000 && (
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  🌟 Income boost coming next month!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start Month Button */}
      <button
        onClick={onStartMonth}
        className="btn-money w-full text-lg py-4 animate-bounce-gentle"
      >
        Start Month {gameState.month} →
      </button>
    </div>
  );
};
