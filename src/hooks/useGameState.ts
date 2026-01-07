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

  // Calculate stability score based on multiple financial factors
  const calculateStability = useCallback((state: GameState): number => {
    const monthlyExpenses = FIXED_EXPENSES.household + FIXED_EXPENSES.farming + FIXED_EXPENSES.education;
    
    // Balance score (0-25 points): positive balance is good
    const balanceRatio = state.balance / monthlyExpenses;
    const balanceScore = Math.min(25, Math.max(0, balanceRatio * 12.5 + 12.5));
    
    // Savings score (0-30 points): more savings = more stability
    const savingsMonths = state.savings / monthlyExpenses; // how many months of expenses covered
    const savingsScore = Math.min(30, savingsMonths * 10);
    
    // Debt score (0-25 points): less debt = more stability
    const debtRatio = state.debt / state.monthlyIncome;
    const debtScore = Math.max(0, 25 - (debtRatio * 15));
    
    // Insurance score (0-10 points): having insurance adds stability
    const insuranceScore = state.hasInsurance ? 10 : 0;
    
    // Financial flexibility score (0-10 points): ability to handle emergencies
    const netWorth = state.balance + state.savings - state.debt;
    const flexibilityRatio = netWorth / monthlyExpenses;
    const flexibilityScore = Math.min(10, Math.max(0, flexibilityRatio * 5 + 5));
    
    const totalScore = balanceScore + savingsScore + debtScore + insuranceScore + flexibilityScore;
    
    return Math.round(Math.min(100, Math.max(0, totalScore)));
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
      let effectiveCost = event.cost || 0;

      // Insurance reduces crop loss cost
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
  }, [calculateStability]);

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
  }, [calculateStability]);

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
  }, [calculateStability]);

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
      const newState = {
        ...prev,
        balance: prev.balance + amount,
        debt: prev.debt + amount + interest,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, [calculateStability]);

  const repayLoan = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.balance < amount || amount <= 0 || prev.debt <= 0) return prev;
      
      const repayAmount = Math.min(amount, prev.debt);
      const newState = {
        ...prev,
        balance: prev.balance - repayAmount,
        debt: prev.debt - repayAmount,
      };

      return {
        ...newState,
        stabilityScore: calculateStability(newState),
      };
    });
  }, [calculateStability]);

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
