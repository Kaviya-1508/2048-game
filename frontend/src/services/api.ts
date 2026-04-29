import axios, { AxiosResponse } from 'axios';
import { ScoreData } from '../types/game.types';

const API_BASE_URL: string = 'http://localhost:8080/api';

export const saveScoreToBackend = async (scoreData: ScoreData): Promise<any> => {
    try {
        const response: AxiosResponse = await axios.post(`${API_BASE_URL}/scores`, scoreData);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getLeaderboard = async (): Promise<any[]> => {
    try {
        const response: AxiosResponse = await axios.get(`${API_BASE_URL}/leaderboard`);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};