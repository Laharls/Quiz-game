import { CONFIG } from './config.js';
import { ApiService } from './apiService.js';
import { calculateScore, getCurrentDate } from './utils.js';

// Classe pour gérer les scores
export class ScoreManager {
    constructor() {
        this.totalScore = 0;
        this.highScores = [];
    }

    addScore(timeLeft) {
        const score = calculateScore(timeLeft, CONFIG.TOTAL_TIME);
        this.totalScore += score;
        return score;
    }

    getTotalScore() {
        return this.totalScore;
    }

    reset() {
        this.totalScore = 0;
    }

    async saveHighScore(playerName) {
        const newScore = {
            name: playerName,
            score: this.totalScore,
            date: getCurrentDate()
        };

        // Récupérer les scores existants
        this.highScores = await ApiService.getHighScores();
        
        // Ajouter le nouveau score
        this.highScores.push(newScore);
        
        // Trier par score décroissant et garder seulement les 10 meilleurs
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, CONFIG.MAX_HIGH_SCORES);
        
        // Sauvegarder
        await ApiService.saveHighScores(this.highScores);
        
        return { newScore, highScores: this.highScores };
    }
}