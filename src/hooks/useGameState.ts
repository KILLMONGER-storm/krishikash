import { useState, useEffect, useCallback } from 'react';
import { GameState, GameEvent, INITIAL_GAME_STATE, FIXED_EXPENSES, GAME_EVENTS, MonthRecord, SAVING_GOALS, YearRecord } from '@/types/game';

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

  const getScaledExpenses = useCallback(() => {
    const multiplier = gameState.difficultyMultiplier;
    return {
      household: Math.round(FIXED_EXPENSES.household * multiplier),
      farming: Math.round(FIXED_EXPENSES.farming * multiplier),
      education: Math.round(FIXED_EXPENSES.education * multiplier),
    };
  }, [gameState.difficultyMultiplier]);

  const getTotalExpenses = useCallback(() => {
    const expenses = getScaledExpenses();
    return expenses.household + expenses.farming + expenses.education;
  }, [getScaledExpenses]);

  const getRandomEvent = useCallback((): GameEvent => {
    const randomIndex = Math.floor(Math.random() * GAME_EVENTS.length);
    const event = { ...GAME_EVENTS[randomIndex] };
    
    // Scale event costs/rewards with difficulty
    const multiplier = gameState.difficultyMultiplier;
    if (event.cost) {
      event.cost = Math.round(event.cost * multiplier);
    }
    if (event.reward) {
      event.reward = Math.round(event.reward * (0.8 + multiplier * 0.2)); // Rewards scale slower
    }
    
    return event;
  }, [gameState.difficultyMultiplier]);

  const startNewMonth = useCallback(() => {
    setGameState(prev => {
      const newBalance = prev.balance + prev.monthlyIncome;
      const expenses = getTotalExpenses();
      const balanceAfterExpenses = newBalance - expenses;
      
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

  const buyInsurance = useCallback(() => {
    const insuranceCost = Math.round(500 * gameState.difficultyMultiplier);
    setGameState(prev => {
      if (prev.balance < insuranceCost || prev.hasInsurance) return prev;

      return {
        ...prev,
        balance: prev.balance - insuranceCost,
        hasInsurance: true,
        stabilityScore: Math.min(100, prev.stabilityScore + 3),
      };
    });
  }, [gameState.difficultyMultiplier]);

  const takeLoan = useCallback((amount: number) => {
    setGameState(prev => {
      const interest = amount * (0.2 + (prev.difficultyMultiplier - 1) * 0.05); // Interest increases with difficulty
      return {
        ...prev,
        balance: prev.balance + amount,
        debt: prev.debt + amount + interest,
        stabilityScore: Math.max(0, prev.stabilityScore - 10),
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
      
      // Check for income growth
      let updatedState = { ...prev };
      if (prev.consecutiveSavingMonths >= 3 && prev.totalSavedThisStreak >= 6000) {
        updatedState = {
          ...updatedState,
          monthlyIncome: prev.monthlyIncome + Math.round(1500 * prev.difficultyMultiplier),
          stabilityScore: Math.min(100, prev.stabilityScore + 10),
          consecutiveSavingMonths: 0,
          totalSavedThisStreak: 0,
        };
      }

      // Year ended - go to year end screen
      if (newMonth > 12) {
        return {
          ...updatedState,
          month: 12,
          gamePhase: 'yearEnd',
          currentEvent: null,
          monthHistory: [...prev.monthHistory, record],
        };
      }

      // Reset insurance monthly
      return {
        ...updatedState,
        month: newMonth,
        gamePhase: 'summary',
        currentEvent: null,
        hasInsurance: false,
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

  const continueToNextYear = useCallback(() => {
    setGameState(prev => {
      const goalCompleted = prev.currentGoal ? prev.savings >= prev.currentGoal.targetAmount : false;
      
      // Record year history
      const yearRecord: YearRecord = {
        year: prev.year,
        finalSavings: prev.savings,
        finalIncome: prev.monthlyIncome,
        finalStabilityScore: prev.stabilityScore,
        goalCompleted,
        goalName: prev.currentGoal?.name || 'None',
      };

      // Find next goal
      const completedGoalIds = goalCompleted && prev.currentGoal 
        ? [...prev.completedGoals, prev.currentGoal.id]
        : prev.completedGoals;
      
      const nextGoal = SAVING_GOALS.find(g => !completedGoalIds.includes(g.id)) || null;
      
      // Calculate new difficulty
      const newDifficulty = prev.difficultyMultiplier + 0.15; // 15% harder each year
      
      // Calculate savings carry-over (keep excess after completing goal)
      let newSavings = prev.savings;
      if (goalCompleted && prev.currentGoal) {
        newSavings = Math.max(0, prev.savings - prev.currentGoal.targetAmount);
      }

      // If no more goals, game ends
      if (!nextGoal) {
        return {
          ...prev,
          gamePhase: 'ended',
          yearHistory: [...prev.yearHistory, yearRecord],
          completedGoals: completedGoalIds,
        };
      }

      return {
        ...prev,
        year: prev.year + 1,
        month: 1,
        savings: newSavings,
        hasInsurance: false,
        debt: prev.debt, // Debt carries over
        consecutiveSavingMonths: 0,
        totalSavedThisStreak: 0,
        gamePhase: 'playing',
        currentEvent: null,
        monthHistory: [],
        currentGoal: nextGoal,
        completedGoals: completedGoalIds,
        yearHistory: [...prev.yearHistory, yearRecord],
        difficultyMultiplier: newDifficulty,
      };
    });
  }, []);

  const getGameResult = useCallback(() => {
    const totalYears = gameState.yearHistory.length + 1;
    const completedGoalsCount = gameState.completedGoals.length;
    
    if (gameState.stabilityScore > 80 && completedGoalsCount >= 3) {
      return {
        title: 'Master Farmer! 🏆',
        description: `Incredible! You completed ${completedGoalsCount} goals across ${totalYears} year${totalYears > 1 ? 's' : ''}!`,
        color: 'success' as const,
      };
    } else if (gameState.stabilityScore > 50 && completedGoalsCount >= 1) {
      return {
        title: 'Successful Farmer! 🌟',
        description: `Well done! You achieved ${completedGoalsCount} goal${completedGoalsCount > 1 ? 's' : ''} and maintained stability.`,
        color: 'warning' as const,
      };
    } else {
      return {
        title: 'Keep Trying! 💪',
        description: 'Financial mastery takes practice. Save more and avoid debt!',
        color: 'destructive' as const,
      };
    }
  }, [gameState.stabilityScore, gameState.yearHistory.length, gameState.completedGoals.length]);

  const getInsuranceCost = useCallback(() => {
    return Math.round(500 * gameState.difficultyMultiplier);
  }, [gameState.difficultyMultiplier]);

  return {
    gameState,
    resetGame,
    startGame,
    startNewMonth,
    handleEvent,
    saveMoney,
    buyInsurance,
    takeLoan,
    endMonth,
    continueToNextMonth,
    continueToNextYear,
    getGameResult,
    getTotalExpenses,
    getScaledExpenses,
    getInsuranceCost,
  };
};
