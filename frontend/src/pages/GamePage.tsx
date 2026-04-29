import Game2048 from '../components/Game2048';

function GamePage() {
    const handleGameOver = (finalScore: number): void => {
        console.log(`Game Over! Final Score: ${finalScore}`);
    };

    const handleExit = (): void => {
        if (window.confirm('Are you sure you want to exit the game?')) {
            window.location.href = '/';
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <button
                onClick={handleExit}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#FF6B6B',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    zIndex: 100,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
            >
                ✕ Exit Game
            </button>

            <Game2048 onGameOver={handleGameOver} />
        </div>
    );
}

export default GamePage;