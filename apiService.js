import { CONFIG } from './config.js';

// Service pour gérer les appels API
export class ApiService {
    static async fetchQuestions() {
        try {
            const response = await fetch(CONFIG.TRIVIA_API_URL);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw new Error('Failed to load questions. Please try again later.');
        }
    }

    static async getHighScores() {
        try {
            const response = await fetch(CONFIG.PANTRY_API_URL);
            if (response.ok) {
                const data = await response.json();
                return data.highScores || [];
            }
            return [];
        } catch (error) {
            console.log('Basket not found, creating a new one');
            return [];
        }
    }

    static async saveHighScores(highScores) {
        try {
            await fetch(CONFIG.PANTRY_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ highScores }),
            });
        } catch (error) {
            console.error('Error saving high score:', error);
            throw error;
        }
    }
}