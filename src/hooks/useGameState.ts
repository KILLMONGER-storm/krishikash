import { useState, useEffect, useCallback } from 'react';
import { GameState, GameEvent, INITIAL_GAME_STATE, FIXED_EXPENSES, GAME_EVENTS, MonthRecord } from '@/types/game';

const STORAGE_KEY = 'krishicash_game_state';

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

  // Persist to localStorage
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
      const newBalance = prev.balance + prev.monthlyIncome;
      const expenses = getTotalExpenses();
      let balanceAfterExpenses = newBalance - expenses;
      
      // Auto-deduct insurance if active
      if (prev.hasInsurance && prev.insuranceAmount > 0) {
        balanceAfterExpenses -= prev.insuranceAmount;
      }
      
      // Deduct debt EMI if any
      let debtPayment = 0;
      if (prev.debt > 0) {
        debtPayment = Math.min(prev.debt / 6, balanceAfterExpenses > 0 ? prev.debt / 6 : 0);
      }

      const event = getRandomEvent();
      
      return {
        ...prev,
        balance: balanceAfterExpenses - debtPayment,
        debt: Math.max(0, prev.debt - debtPayment),
        currentEvent: event,
        gamePhase: 'event',
      };
    });
  }, [getTotalExpenses, getRandomEvent]);

  const handleEvent = useCallback((event: GameEvent) => {
    setGameState(prev => {
      let newBalance = prev.balance;
      let newStability = prev.stabilityScore;
      let effectiveCost = event.cost || 0;

      // Insurance reduces crop loss cost
      if (event.type === 'crop_loss' && prev.hasInsurance) {
        effectiveCost = Math.min(500, effectiveCost);
      }

      if (effectiveCost > 0) {
        newBalance -= effectiveCost;
        newStability = Math.max(0, newStability - 5);
      }

      if (event.reward) {
        newBalance += event.reward;
        newStability = Math.min(100, newStability + 5);
      }

      return {
        ...prev,
        balance: newBalance,
        stabilityScore: newStability,
        gamePhase: 'decision',
      };
    });
  }, []);

  const saveMoney = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.balance < amount || amount <= 0) return prev;

      const newSavings = prev.savings + amount;
      const newStreak = prev.consecutiveSavingMonths + 1;
      const newTotalStreak = prev.totalSavedThisStreak + amount;

      return {
        ...prev,
        balance: prev.balance - amount,
        savings: newSavings,
        stabilityScore: Math.min(100, prev.stabilityScore + 5),
        consecutiveSavingMonths: newStreak,
        totalSavedThisStreak: newTotalStreak,
      };
    });
  }, []);

  const buyInsurance = useCallback((amount: number = 500) => {
    setGameState(prev => {
      if (prev.balance < amount) return prev;

      return {
        ...prev,
        balance: prev.balance - amount,
        hasInsurance: true,
        insuranceAmount: amount,
        stabilityScore: Math.min(100, prev.stabilityScore + 3),
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
      const interest = amount * 0.2;
      return {
        ...prev,
        balance: prev.balance + amount,
        debt: prev.debt + amount + interest,
        stabilityScore: Math.max(0, prev.stabilityScore - 10),
      };
    });
  }, []);

  const repayLoan = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.balance < amount || amount <= 0 || prev.debt <= 0) return prev;
      
      const repayAmount = Math.min(amount, prev.debt);
      
      return {
        ...prev,
        balance: prev.balance - repayAmount,
        debt: prev.debt - repayAmount,
        stabilityScore: Math.min(100, prev.stabilityScore + 5),
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

      // Insurance persists - no longer reset monthly
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
    if (gameState.stabilityScore > 80) {
      return {
        title: 'Financially Secure Farmer! 🌟',
        description: 'Excellent! You managed your finances wisely and built a stable future.',
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
  }, [gameState.stabilityScore]);

  return {
    gameState,
    resetGame,
    startGame,
    startNewMonth,
    handleEvent,
    saveMoney,
    buyInsurance,
    updateInsurance,
    stopInsurance,
    takeLoan,
    repayLoan,
    endMonth,
    continueToNextMonth,
    getGameResult,
    getTotalExpenses,
  };
};
