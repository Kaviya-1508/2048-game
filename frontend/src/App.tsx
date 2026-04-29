import { useState } from 'react';
import SplashPage from './pages/SplashPage';
import LoadingPage from './pages/LoadingPage';
import GamePage from './pages/GamePage';

type GameState = 'splash' | 'loading' | 'game';

function App() {
  const [gameState, setGameState] = useState<GameState>('splash');

  const handlePlay = (): void => {
    setGameState('loading');
    setTimeout(() => {
      setGameState('game');
    }, 2500);
  };

  return (
    <div className="app">
      {gameState === 'splash' && <SplashPage onPlay={handlePlay} />}
      {gameState === 'loading' && <LoadingPage />}
      {gameState === 'game' && <GamePage />}
    </div>
  );
}

export default App;