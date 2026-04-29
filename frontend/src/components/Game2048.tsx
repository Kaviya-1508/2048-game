import { useState, useEffect, useCallback, useRef } from 'react';
import { Grid, Direction } from '../types/game.types';

interface Game2048Props {
    onGameOver: (score: number) => void;
    saveScore?: (score: number, playerName: string) => Promise<void>;
    playerName?: string | null;
}

function Game2048({ onGameOver }: Game2048Props): JSX.Element {
    const [grid, setGrid] = useState<Grid>([]);
    const [score, setScore] = useState<number>(0);
    const [bestScore, setBestScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [won, setWon] = useState<boolean>(false);

    // Touch swipe handling
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const isTouching = useRef<boolean>(false);

    // Initialize grid
    const initGrid = (): Grid => {
        const newGrid: Grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        return newGrid;
    };

    // Add random tile (2 or 4)
    const addRandomTile = (grid: Grid): void => {
        const emptyCells: [number, number][] = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) emptyCells.push([i, j]);
            }
        }
        if (emptyCells.length > 0) {
            const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    // Check for win
    const checkWin = (grid: Grid): boolean => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    };

    // Check for game over
    const checkGameOver = (grid: Grid): boolean => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) return false;
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
                if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
            }
        }
        return true;
    };

    // Move left
    const moveLeft = (grid: Grid): { newGrid: Grid; scoreGained: number } => {
        let newGrid: Grid = grid.map(row => [...row]);
        let scoreGained: number = 0;

        for (let i = 0; i < 4; i++) {
            let row = newGrid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    scoreGained += row[j];
                    row[j + 1] = 0;
                }
            }
            row = row.filter(cell => cell !== 0);
            while (row.length < 4) row.push(0);
            newGrid[i] = row;
        }

        return { newGrid, scoreGained };
    };

    // Move right
    const moveRight = (grid: Grid): { newGrid: Grid; scoreGained: number } => {
        let newGrid: Grid = grid.map(row => [...row].reverse());
        let { newGrid: reversedGrid, scoreGained } = moveLeft(newGrid);
        return { newGrid: reversedGrid.map(row => row.reverse()), scoreGained };
    };

    // Move up
    const moveUp = (grid: Grid): { newGrid: Grid; scoreGained: number } => {
        let transposed: Grid = grid[0].map((_, col) => grid.map(row => row[col]));
        let { newGrid: moved, scoreGained } = moveLeft(transposed);
        let finalGrid: Grid = moved[0].map((_, col) => moved.map(row => row[col]));
        return { newGrid: finalGrid, scoreGained };
    };

    // Move down
    const moveDown = (grid: Grid): { newGrid: Grid; scoreGained: number } => {
        let transposed: Grid = grid[0].map((_, col) => grid.map(row => row[col]));
        let { newGrid: moved, scoreGained } = moveRight(transposed);
        let finalGrid: Grid = moved[0].map((_, col) => moved.map(row => row[col]));
        return { newGrid: finalGrid, scoreGained };
    };

    // Reset game function
    const resetGame = (): void => {
        const newGrid = initGrid();
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        setWon(false);
    };

    // Handle moves
    const handleMove = useCallback((direction: Direction): void => {
        if (gameOver || won) return;

        let result: { newGrid: Grid; scoreGained: number };
        switch (direction) {
            case 'left': result = moveLeft(grid); break;
            case 'right': result = moveRight(grid); break;
            case 'up': result = moveUp(grid); break;
            case 'down': result = moveDown(grid); break;
            default: return;
        }

        const changed: boolean = JSON.stringify(result.newGrid) !== JSON.stringify(grid);

        if (changed) {
            const newGrid: Grid = result.newGrid;
            addRandomTile(newGrid);
            setGrid(newGrid);
            const newScore: number = score + result.scoreGained;
            setScore(newScore);

            if (result.scoreGained > 0 && bestScore < newScore) {
                setBestScore(newScore);
                localStorage.setItem('bestScore', newScore.toString());
            }

            if (checkWin(newGrid)) {
                setWon(true);
                return;
            }
            if (checkGameOver(newGrid)) {
                setGameOver(true);
                onGameOver(newScore);
            }
        }
    }, [grid, gameOver, won, score, bestScore, onGameOver]);

    // Keyboard event listener (Desktop)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            switch (e.key) {
                case 'ArrowLeft': handleMove('left'); break;
                case 'ArrowRight': handleMove('right'); break;
                case 'ArrowUp': handleMove('up'); break;
                case 'ArrowDown': handleMove('down'); break;
                default: return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove]);

    // Touch swipe handlers (Mobile) - Only prevent on game area
    const handleTouchStart = (e: React.TouchEvent): void => {
        // Only prevent default on the game grid, not on buttons
        const target = e.target as HTMLElement;
        if (!target.closest('button')) {
            e.preventDefault();
        }
        const touch = e.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
        isTouching.current = true;
    };

    const handleTouchEnd = (e: React.TouchEvent): void => {
        // Only prevent default on the game grid, not on buttons
        const target = e.target as HTMLElement;
        if (!target.closest('button')) {
            e.preventDefault();
        }

        if (!touchStart.current || !isTouching.current) {
            touchStart.current = null;
            isTouching.current = false;
            return;
        }

        const touchEnd = e.changedTouches[0];
        const deltaX = touchEnd.clientX - touchStart.current.x;
        const deltaY = touchEnd.clientY - touchStart.current.y;

        const minSwipeDistance = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    handleMove('right');
                } else {
                    handleMove('left');
                }
            }
        } else {
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    handleMove('down');
                } else {
                    handleMove('up');
                }
            }
        }

        touchStart.current = null;
        isTouching.current = false;
    };

    const handleTouchCancel = (): void => {
        touchStart.current = null;
        isTouching.current = false;
    };

    // Initialize game
    useEffect(() => {
        const savedBest: string | null = localStorage.getItem('bestScore');
        if (savedBest) setBestScore(parseInt(savedBest));
        setGrid(initGrid());
    }, []);

    const getTileClass = (value: number): string => {
        if (value === 0) return 'cell';
        return `cell tile-${value}`;
    };

    return (
        <div
            className="game-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            <div className="swipe-hint">
                👆 Swipe to play
            </div>

            <div className="score-container">
                <div className="score-box">
                    <div className="score-label">SCORE</div>
                    <div className="score-value">{score}</div>
                </div>
                <div className="score-box">
                    <div className="score-label">BEST</div>
                    <div className="score-value">{bestScore}</div>
                </div>
            </div>

            <div className="grid">
                {grid.map((row, i: number) => (
                    <div key={i} className="grid-row">
                        {row.map((cell: number, j: number) => (
                            <div key={j} className={getTileClass(cell)}>
                                {cell !== 0 ? cell : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="game-controls">
                <button
                    className="new-game-btn"
                    onClick={resetGame}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        resetGame();
                    }}
                >
                    New Game
                </button>
            </div>

            {(gameOver || won) && (
                <div className="game-over-overlay">
                    <div className="game-over-modal">
                        <h2>{won ? 'YOU WIN! 🎉' : 'GAME OVER! 💀'}</h2>
                        <p>Your Score: {score}</p>
                        <button
                            className="play-again-btn"
                            onClick={resetGame}
                            onTouchEnd={(e) => {
                                e.stopPropagation();
                                resetGame();
                            }}
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game2048;