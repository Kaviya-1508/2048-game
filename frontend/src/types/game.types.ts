export type Grid = number[][];
export type Direction = 'left' | 'right' | 'up' | 'down';

export interface ScoreData {
    playerName: string;
    score: number;
    highestTile?: number;
    date?: Date;
}

export interface GameState {
    grid: Grid;
    score: number;
    bestScore: number;
    gameOver: boolean;
    won: boolean;
}