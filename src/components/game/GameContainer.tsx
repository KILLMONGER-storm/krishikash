import { useGameState } from '@/hooks/useGameState';
import { IntroScreen } from './IntroScreen';
import { GoalSelectionScreen } from './GoalSelectionScreen';
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
  } = useGameState();

  // Intro screen
  if (gameState.gamePhase === 'intro') {
    return <IntroScreen onStart={startGame} />;
  }

  // Goal selection screen
  if (gameState.gamePhase === 'goal_selection') {
    return <GoalSelectionScreen onSelectGoal={selectGoal} />;
  }

  // Game ended screen
  if (gameState.gamePhase === 'ended') {
    return (
      <GameEndScreen
        gameState={gameState}
        result={getGameResult()}
        onRestart={resetGame}
        onPurchaseGoal={purchaseGoal}
      />
    );
  }

  // Main game container
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-8">
        <GameHeader 
          month={gameState.month} 
          onReset={resetGame}
          selectedGoal={gameState.selectedGoal}
          savings={gameState.savings}
        />

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
              insuranceAmount={gameState.insuranceAmount}
              debt={gameState.debt}
              loanMonthsRemaining={gameState.loanMonthsRemaining}
              onSave={saveMoney}
              onBuyInsurance={buyInsurance}
              onUpdateInsurance={updateInsurance}
              onStopInsurance={stopInsurance}
              onTakeLoan={takeLoan}
              onRepayLoan={repayLoan}
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
