import { QuizGame } from './quizGame.js';

// Point d'entrée principal de l'application
document.addEventListener('DOMContentLoaded', () => {
    const game = new QuizGame();
    game.init();
});