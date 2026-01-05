import { useGameState } from '@/hooks/useGameState';
import { IntroScreen } from './IntroScreen';
import { Dashboard } from './Dashboard';
import { EventCard } from './EventCard';
import { DecisionPanel } from './DecisionPanel';
import { MonthSummary } from './MonthSummary';
import { GameEndScreen } from './GameEndScreen';
import { GameHeader } from './GameHeader';

export const GameContainer = () => {
  const {
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
    getGameResult,
  } = useGameState();

  // Intro screen
  if (gameState.gamePhase === 'intro') {
    return <IntroScreen onStart={startGame} />;
  }

  // Game ended screen
  if (gameState.gamePhase === 'ended') {
    return (
      <GameEndScreen
        gameState={gameState}
        result={getGameResult()}
        onRestart={resetGame}
      />
    );
  }

  // Main game container
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-8">
        <GameHeader month={gameState.month} onReset={resetGame} />

        {/* Dashboard view */}
        {gameState.gamePhase === 'playing' && (
          <Dashboard
            gameState={gameState}
            onStartMonth={startNewMonth}
          />
        )}

        {/* Event view */}
        {gameState.gamePhase === 'event' && gameState.currentEvent && (
          <EventCard
            event={gameState.currentEvent}
            hasInsurance={gameState.hasInsurance}
            onContinue={() => handleEvent(gameState.currentEvent!)}
          />
        )}

        {/* Decision view */}
        {gameState.gamePhase === 'decision' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Make Your Decisions</h2>
              <p className="text-sm text-muted-foreground">
                Balance: ₹{gameState.balance.toLocaleString()}
              </p>
            </div>
            <DecisionPanel
              balance={gameState.balance}
              hasInsurance={gameState.hasInsurance}
              debt={gameState.debt}
              onSave={saveMoney}
              onBuyInsurance={buyInsurance}
              onTakeLoan={takeLoan}
              onEndMonth={endMonth}
            />
          </div>
        )}

        {/* Month summary view */}
        {gameState.gamePhase === 'summary' && (
          <MonthSummary
            gameState={gameState}
            onContinue={continueToNextMonth}
          />
        )}
      </div>
    </div>
  );
};
