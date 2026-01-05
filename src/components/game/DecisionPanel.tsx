import { useState } from 'react';
import { PiggyBank, Shield, Banknote, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionPanelProps {
  balance: number;
  hasInsurance: boolean;
  debt: number;
  insuranceCost?: number;
  onSave: (amount: number) => void;
  onBuyInsurance: () => void;
  onTakeLoan: (amount: number) => void;
  onEndMonth: () => void;
}

export const DecisionPanel = ({
  balance,
  hasInsurance,
  debt,
  insuranceCost = 500,
  onSave,
  onBuyInsurance,
  onTakeLoan,
  onEndMonth,
}: DecisionPanelProps) => {
  const [saveAmount, setSaveAmount] = useState(2000);
  const [showLoanConfirm, setShowLoanConfirm] = useState(false);

  const savingOptions = [1000, 2000, 3000, 5000];
  const loanAmount = 5000;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Save Money Section */}
      <div className="game-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Save Money</h3>
            <p className="text-xs text-muted-foreground">Build your savings for the future</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          {savingOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => setSaveAmount(amount)}
              className={cn(
                'py-2 px-3 rounded-lg text-sm font-semibold transition-all',
                saveAmount === amount
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-emerald-100'
              )}
            >
              ₹{amount.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSave(saveAmount)}
          disabled={balance < saveAmount}
          className={cn(
            'btn-success w-full',
            balance < saveAmount && 'opacity-50 cursor-not-allowed'
          )}
        >
          Save ₹{saveAmount.toLocaleString()}
        </button>
        
        {balance < saveAmount && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Insufficient balance
          </p>
        )}
      </div>

      {/* Insurance Section */}
      <div className="game-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Crop Insurance</h3>
            <p className="text-xs text-muted-foreground">Protect against crop loss (₹{insuranceCost.toLocaleString()}/month)</p>
          </div>
          {hasInsurance && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
              Active
            </span>
          )}
        </div>

        <button
          onClick={onBuyInsurance}
          disabled={hasInsurance || balance < insuranceCost}
          className={cn(
            'btn-game w-full bg-blue-500 text-white hover:bg-blue-600',
            (hasInsurance || balance < insuranceCost) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {hasInsurance ? '✓ Already Insured' : `Buy Insurance - ₹${insuranceCost.toLocaleString()}`}
        </button>
      </div>

      {/* Loan Section */}
      <div className="game-card border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Quick Loan</h3>
            <p className="text-xs text-red-500">⚠️ 20% interest - Use with caution!</p>
          </div>
          {debt > 0 && (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
              Debt: ₹{debt.toLocaleString()}
            </span>
          )}
        </div>

        {!showLoanConfirm ? (
          <button
            onClick={() => setShowLoanConfirm(true)}
            className="btn-game w-full bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200"
          >
            Take Loan - ₹{loanAmount.toLocaleString()}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600 text-center font-medium">
              You will repay ₹{(loanAmount * 1.2).toLocaleString()} total. Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLoanConfirm(false)}
                className="btn-game flex-1 bg-muted text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onTakeLoan(loanAmount);
                  setShowLoanConfirm(false);
                }}
                className="btn-game flex-1 bg-red-500 text-white"
              >
                Confirm Loan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* End Month Button */}
      <button
        onClick={onEndMonth}
        className="btn-primary-game w-full flex items-center justify-center gap-2"
      >
        End Month <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
