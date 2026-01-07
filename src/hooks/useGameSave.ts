import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GameState } from '@/types/game';
import { useAuth } from './useAuth';
import { toast } from './use-toast';
import { Json } from '@/integrations/supabase/types';

export const useGameSave = () => {
  const { user } = useAuth();

  const saveGame = useCallback(async (gameState: GameState) => {
    if (!user) return { error: new Error('Not logged in') };

    const saveData = {
      user_id: user.id,
      game_state: JSON.parse(JSON.stringify(gameState)) as Json,
      difficulty: gameState.difficulty,
      goal_name: gameState.selectedGoal?.name || null,
      month: gameState.month,
      savings: gameState.savings,
      stability_score: gameState.stabilityScore,
    };

    const { error } = await supabase
      .from('game_saves')
      .upsert([saveData], { onConflict: 'user_id' });

    if (error) {
      toast({
        title: 'Save Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '💾 Game Saved!',
        description: 'Your progress has been saved to the cloud.',
      });
    }

    return { error };
  }, [user]);

  const loadGame = useCallback(async (): Promise<GameState | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('game_saves')
      .select('game_state')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Load Failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }

    if (data?.game_state) {
      toast({
        title: '📂 Game Loaded!',
        description: 'Your saved progress has been restored.',
      });
      return data.game_state as unknown as GameState;
    }

    return null;
  }, [user]);

  const deleteSave = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('game_saves')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [user]);

  return { saveGame, loadGame, deleteSave, isLoggedIn: !!user };
};
