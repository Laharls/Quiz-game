import { ApiService } from './apiService.js';
import { Timer } from './timer.js';
import { UIManager } from './uiManager.js';
import { ScoreManager } from './scoreManager.js';

// Classe principale du jeu de quiz
export class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.questions = [];
        
        // Initialiser les gestionnaires
        this.timer = new Timer(document.getElementById('time-left'));
        this.ui = new UIManager();
        this.scoreManager = new ScoreManager();
        
        // Lier les méthodes au contexte
        this.handleNext = this.handleNext.bind(this);
        this.handlePlayAgain = this.handlePlayAgain.bind(this);
        this.handleTimeUp = this.handleTimeUp.bind(this);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
    }

    async init() {
        try {
            // Configurer les écouteurs d'événements
            this.ui.setupEventListeners(this.handleNext, this.handlePlayAgain);
            
            // Charger les questions
            await this.loadQuestions();
        } catch (error) {
            this.ui.showError(error.message);
        }
    }

    async loadQuestions() {
        this.questions = await ApiService.fetchQuestions();
        this.loadCurrentQuestion();
    }

    loadCurrentQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.ui.displayQuestion(question, this.currentQuestion, this.handleChoiceClick);
        
        this.timer.reset();
        this.timer.start(this.handleTimeUp);
    }

    handleChoiceClick(selectedAnswer, correctAnswer) {
        this.timer.stop();
        this.ui.disableChoices();
        this.ui.highlightAnswers(correctAnswer);

        if (selectedAnswer === correctAnswer) {
            const timeLeft = this.timer.getTimeLeft();
            this.scoreManager.addScore(timeLeft);
        }

        this.ui.enableNextButton();
    }

    handleTimeUp() {
        this.ui.disableChoices();
        const correctAnswer = this.questions[this.currentQuestion].correct_answer;
        this.ui.highlightAnswers(correctAnswer);
        this.ui.enableNextButton();
    }

    handleNext() {
        this.currentQuestion++;
        this.loadCurrentQuestion();
    }

    async endGame() {
        this.ui.hideQuiz();
        await this.saveHighScore();
    }

    async saveHighScore() {
        const playerName = this.ui.promptForName();
        if (!playerName) return;

        this.ui.showLoader();

        try {
            const { newScore, highScores } = await this.scoreManager.saveHighScore(playerName);
            this.displayHighScores(newScore, highScores);
        } catch (error) {
            console.error('Error saving high score:', error);
        }
    }

    displayHighScores(newScore, highScores) {
        this.ui.displayHighScoresList(highScores, newScore);
        this.ui.hideLoader();
        this.ui.showHighScores();
    }

    handlePlayAgain() {
        window.location.reload();
    }
}