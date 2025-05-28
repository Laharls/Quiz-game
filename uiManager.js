import { decodeHTML } from './utils.js';

// Classe pour gérer l'interface utilisateur
export class UIManager {
    constructor() {
        this.elements = {
            quizbox: document.getElementById('quiz-box'),
            questionNumber: document.getElementById('question-number'),
            questionText: document.getElementById('question-text'),
            choicesContainer: document.getElementById('choices-container'),
            nextBtn: document.getElementById('next-btn'),
            loader: document.getElementById('loader'),
            highScoreContainer: document.getElementById('high-score-container'),
            highScoresList: document.getElementById('high-scores-list'),
            playAgainBtn: document.getElementById('play-again-btn')
        };
    }

    displayQuestion(question, questionIndex, onChoiceClick) {
        this.elements.questionText.innerText = decodeHTML(question.question);
        this.elements.questionNumber.innerText = `Question ${questionIndex + 1}`;
        
        this.clearChoices();
        this.elements.nextBtn.disabled = true;

        const choices = [...question.incorrect_answers, question.correct_answer]
            .sort(() => Math.random() - 0.5);
        
        choices.forEach(choice => {
            const trimmedChoice = choice.trim();
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('choice');
            button.innerText = decodeHTML(trimmedChoice);
            button.onclick = () => onChoiceClick(trimmedChoice, question.correct_answer.trim());
            this.elements.choicesContainer.appendChild(button);
        });
    }

    clearChoices() {
        this.elements.choicesContainer.innerText = '';
    }

    disableChoices() {
        const choices = document.querySelectorAll('.choice');
        choices.forEach(choice => {
            choice.disabled = true;
        });
    }

    highlightAnswers(correctAnswer) {
        const choices = document.querySelectorAll('.choice');
        choices.forEach(choice => {
            if (choice.innerText === decodeHTML(correctAnswer)) {
                choice.classList.add('correct');
            } else {
                choice.classList.add('wrong');
            }
            choice.disabled = true;
        });
    }

    showError(message) {
        this.elements.questionNumber.innerText = message;
    }

    hideQuiz() {
        this.elements.quizbox.style.display = 'none';
    }

    showLoader() {
        this.elements.loader.style.display = 'block';
    }

    hideLoader() {
        this.elements.loader.style.display = 'none';
    }

    showHighScores() {
        this.elements.highScoreContainer.style.display = 'flex';
    }

    displayHighScoresList(highScores, newScore) {
        this.elements.highScoresList.innerText = '';

        highScores.forEach((score) => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.innerText = score.name;

            const scoreCell = document.createElement('td');
            scoreCell.innerText = score.score;

            const dateCell = document.createElement('td');
            dateCell.innerText = score.date;

            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);

            if (score.name === newScore.name && 
                score.score === newScore.score && 
                score.date === newScore.date) {
                row.classList.add('highlight');
            }

            this.elements.highScoresList.appendChild(row);
        });
    }

    enableNextButton() {
        this.elements.nextBtn.disabled = false;
    }

    promptForName() {
        return prompt('Enter your name for the scoreboard');
    }

    setupEventListeners(onNext, onPlayAgain) {
        this.elements.nextBtn.addEventListener('click', onNext);
        this.elements.playAgainBtn.addEventListener('click', onPlayAgain);
    }
}