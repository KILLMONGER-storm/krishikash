import { useState, useEffect, useCallback } from 'react';
import { GameState, GameEvent, INITIAL_GAME_STATE, FIXED_EXPENSES, GAME_EVENTS, MonthRecord, GameGoal } from '@/types/game';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'krishicash_game_state';
const LOAN_INTEREST_RATE = 0.05;
const MAX_LOAN_MONTHS = 6;

const calculateStability = (state: GameState): number => {
  const monthlyExpenses = FIXED_EXPENSES.household + FIXED_EXPENSES.farming + FIXED_EXPENSES.education;
  
  const balanceRatio = state.balance / monthlyExpenses;
  const balanceScore = Math.min(25, Math.max(0, balanceRatio * 12.5 + 12.5));
  
  const savingsMonths = state.savings / monthlyExpenses;
  const savingsScore = Math.min(30, savingsMonths * 10);
  
  const debtRatio = state.debt / state.monthlyIncome;
  const debtScore = Math.max(0, 25 - (debtRatio * 15));
  
  const insuranceScore = state.hasInsurance ? 10 : 0;
  
  const netWorth = state.balance + state.savings - state.debt;
  const flexibilityRatio = netWorth / monthlyExpenses;
  const flexibilityScore = Math.min(10, Math.max(0, flexibilityRatio * 5 + 5));
  
  const totalScore = balanceScore + savingsScore + debtScore + insuranceScore + flexibilityScore;
  
  return Math.round(Math.min(100, Math.max(0, totalScore)));
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_GAME_STATE;
      }
    }
    return INITIAL_GAME_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'goal_selection',
    }));
  }, []);

  const selectGoal = useCallback((goal: GameGoal) => {
    setGameState(prev => ({
      ...prev,
      selectedGoal: goal,
      gamePhase: 'playing',
    }));
  }, []);

  const getTotalExpenses = useCallback(() => {
    return FIXED_EXPENSES.household + FIXED_EXPENSES.farming + FIXED_EXPENSES.education;
  }, []);

  const getRandomEvent = useCallback((): GameEvent => {
    const randomIndex = Math.floor(Math.random() * GAME_EVENTS.length);
    return { ...GAME_EVENTS[randomIndex] };
  }, []);

  const startNewMonth = useCallback(() => {
    setGameState(prev => {
      if (prev.debt > 0 && prev.loanMonthsRemaining <= 0) {
        return {
          ...prev,
          propertyConfiscated: true,
          gamePhase: 'ended',
        };
      }

      const newBalance = prev.balance + prev.monthlyIncome;
      const expenses = getTotalExpenses();
      let balanceAfterExpenses = newBalance - expenses;
      
      if (prev.hasInsurance && prev.insuranceAmount > 0) {
        balanceAfterExpenses -= prev.insuranceAmount;
      }
      
      let newDebt = prev.debt;
      let newLoanMonths = prev.loanMonthsRemaining;
      
      if (prev.debt > 0) {
        newDebt = prev.debt * (1 + LOAN_INTEREST_RATE);
        newLoanMonths = prev.loanMonthsRemaining - 1;
        
        // Show warning when 2 months remaining
        if (newLoanMonths === 2) {
          toast({
            title: "⚠️ Loan Warning!",
            description: "Only 2 months left to repay your loan! Your property will be confiscated if not paid.",
            variant: "destructive",
          });
        }
      }

      const event = getRandomEvent();
      
      return {
        ...prev,
        balance: balanceAfterExpenses,
        debt: Math.round(newDebt),
        loanMonthsRemaining: newLoanMonths,
        currentEvent: event,
        gamePhase: 'event',
      };
    });
  }, [getTotalExpenses, getRandomEvent]);

  const handleEvent = useCallback((event: GameEvent) => {
    setGameState(prev => {
      let newBalance = prev.balance;
      let effectiveCost = event.cost || 0;

      if (event.type === 'crop_loss' && prev.hasInsurance) {
        effectiveCost = Math.min(500, effectiveCost);
      }

      if (effectiveCost > 0) {
        newBalance -= effectiveCost;
      }

      if (event.reward) {
        newBalance += event.reward;
      }

      const newState = {
        ...prev,
        balance: newBalance,
        gamePhase: 'decision' as const,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, []);

  const saveMoney = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.balance < amount || amount <= 0) return prev;

      const newState = {
        ...prev,
        balance: prev.balance - amount,
        savings: prev.savings + amount,
        consecutiveSavingMonths: prev.consecutiveSavingMonths + 1,
        totalSavedThisStreak: prev.totalSavedThisStreak + amount,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, []);

  const buyInsurance = useCallback((amount: number = 500) => {
    setGameState(prev => {
      if (prev.balance < amount) return prev;

      const newState = {
        ...prev,
        balance: prev.balance - amount,
        hasInsurance: true,
        insuranceAmount: amount,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, []);

  const updateInsurance = useCallback((newAmount: number) => {
    setGameState(prev => {
      if (!prev.hasInsurance) return prev;
      
      return {
        ...prev,
        insuranceAmount: newAmount,
      };
    });
  }, []);

  const stopInsurance = useCallback(() => {
    setGameState(prev => {
      return {
        ...prev,
        hasInsurance: false,
        insuranceAmount: 0,
      };
    });
  }, []);

  const takeLoan = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.debt > 0) return prev;
      
      const newState = {
        ...prev,
        balance: prev.balance + amount,
        debt: amount,
        loanMonthsRemaining: MAX_LOAN_MONTHS,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, []);

  const repayLoan = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.balance < amount || amount <= 0 || prev.debt <= 0) return prev;
      
      const repayAmount = Math.min(amount, prev.debt);
      const newDebt = prev.debt - repayAmount;
      
      const newState = {
        ...prev,
        balance: prev.balance - repayAmount,
        debt: newDebt,
        loanMonthsRemaining: newDebt <= 0 ? 0 : prev.loanMonthsRemaining,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, []);

  const purchaseGoal = useCallback(() => {
    setGameState(prev => {
      if (!prev.selectedGoal) return prev;
      if (prev.savings < prev.selectedGoal.cost) return prev;
      
      const finalValue = Math.round(prev.selectedGoal.cost * 1.1);
      
      return {
        ...prev,
        savings: prev.savings - prev.selectedGoal.cost,
        goalAchieved: true,
        selectedGoal: {
          ...prev.selectedGoal,
          cost: finalValue,
        },
      };
    });
  }, []);

  const endMonth = useCallback(() => {
    setGameState(prev => {
      const record: MonthRecord = {
        month: prev.month,
        income: prev.monthlyIncome,
        expenses: getTotalExpenses(),
        savings: prev.savings,
        balance: prev.balance,
        event: prev.currentEvent || undefined,
        decisions: [],
      };

      const newMonth = prev.month + 1;

      if (newMonth > 12) {
        return {
          ...prev,
          month: 12,
          gamePhase: 'ended',
          currentEvent: null,
          monthHistory: [...prev.monthHistory, record],
        };
      }

      return {
        ...prev,
        month: newMonth,
        gamePhase: 'summary',
        currentEvent: null,
        monthHistory: [...prev.monthHistory, record],
      };
    });
  }, [getTotalExpenses]);

  const continueToNextMonth = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
    }));
  }, []);

  const getGameResult = useCallback(() => {
    if (gameState.propertyConfiscated) {
      return {
        title: 'Property Confiscated! 💔',
        description: 'You couldn\'t repay your loan within 6 months. Your property has been seized.',
        color: 'destructive' as const,
      };
    }

    if (gameState.goalAchieved && gameState.selectedGoal) {
      return {
        title: `Congratulations! You bought a ${gameState.selectedGoal.name}! ${gameState.selectedGoal.emoji}`,
        description: `Amazing! Your ${gameState.selectedGoal.name} is now worth ₹${gameState.selectedGoal.cost.toLocaleString()} (10% appreciation)!`,
        color: 'success' as const,
      };
    }

    if (gameState.selectedGoal && gameState.savings >= gameState.selectedGoal.cost) {
      return {
        title: `Goal Achieved! ${gameState.selectedGoal.emoji}`,
        description: `You saved enough to buy a ${gameState.selectedGoal.name}! You can now purchase it.`,
        color: 'success' as const,
      };
    }

    if (gameState.stabilityScore > 80) {
      return {
        title: 'Financially Secure Farmer! 🌟',
        description: gameState.selectedGoal 
          ? `Great progress! You need ₹${(gameState.selectedGoal.cost - gameState.savings).toLocaleString()} more for your ${gameState.selectedGoal.name}.`
          : 'Excellent! You managed your finances wisely and built a stable future.',
        color: 'success' as const,
      };
    } else if (gameState.stabilityScore > 50) {
      return {
        title: 'Stable but Needs Improvement 📊',
        description: 'You did okay, but there\'s room to improve your financial habits.',
        color: 'warning' as const,
      };
    } else {
      return {
        title: 'Financially Vulnerable ⚠️',
        description: 'Your finances need attention. Try saving more and avoiding debt.',
        color: 'destructive' as const,
      };
    }
  }, [gameState.stabilityScore, gameState.selectedGoal, gameState.savings, gameState.goalAchieved, gameState.propertyConfiscated]);

  return {
    gameState,
    resetGame,
    startGame,
    selectGoal,
    startNewMonth,
    handleEvent,
    saveMoney,
    buyInsurance,
    updateInsurance,
    stopInsurance,
    takeLoan,
    repayLoan,
    purchaseGoal,
    endMonth,
    continueToNextMonth,
    getGameResult,
    getTotalExpenses,
  };
};
