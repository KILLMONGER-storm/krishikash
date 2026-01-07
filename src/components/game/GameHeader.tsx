import { useState } from 'react';
import { Sprout, RotateCcw, Target, Save, LogIn, LogOut, User, Cloud } from 'lucide-react';
import { GameGoal, GameState } from '@/types/game';
import { useAuth } from '@/hooks/useAuth';
import { useGameSave } from '@/hooks/useGameSave';
import { AuthModal } from '@/components/auth/AuthModal';

interface GameHeaderProps {
  month: number;
  onReset: () => void;
  selectedGoal?: GameGoal | null;
  savings?: number;
  gameState?: GameState;
  onLoadGame?: (state: GameState) => void;
  isSaving?: boolean;
}

export const GameHeader = ({ month, onReset, selectedGoal, savings = 0, gameState, onLoadGame, isSaving = false }: GameHeaderProps) => {
  const progress = selectedGoal ? Math.min(100, (savings / selectedGoal.cost) * 100) : 0;
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { saveGame, loadGame, isLoggedIn } = useGameSave();

  const handleSave = async () => {
    if (gameState) {
      await saveGame(gameState);
    }
  };

  const handleLoad = async () => {
    const loaded = await loadGame();
    if (loaded && onLoadGame) {
      onLoadGame(loaded);
    }
  };
  
  return (
    <>
      <header className="py-4 px-2 border-b border-border mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">KrishiCash</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-1 text-primary animate-pulse" title="Saving...">
                <Cloud className="w-4 h-4" />
              </div>
            )}
            <span className="text-sm font-semibold text-muted-foreground">
              Month {month}/12
            </span>
            
            {!loading && (
              <>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-primary hover:text-primary/80"
                      title="Save Game"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleLoad}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Load Game"
                    >
                      <User className="w-4 h-4" />
                    </button>
                    <button
                      onClick={signOut}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-primary hover:text-primary/80"
                    title="Sign In to Save"
                  >
                    <LogIn className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={onReset}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {selectedGoal && (
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Goal:</span>
            <span className="text-xs font-semibold">{selectedGoal.emoji} {selectedGoal.name}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
          </div>
        )}
      </header>
      
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};
