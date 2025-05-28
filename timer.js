import { CONFIG } from './config.js';
import { formatTime } from './utils.js';

// Classe pour gérer le timer
export class Timer {
    constructor(timerDisplay) {
        this.timerDisplay = timerDisplay;
        this.timerInterval = null;
        this.startTime = 0;
        this.onTimeUp = null;
    }

    start(onTimeUp) {
        this.onTimeUp = onTimeUp;
        this.startTime = Date.now();
        let timeLeft = CONFIG.TOTAL_TIME;
        this.updateDisplay(timeLeft);

        this.timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - this.startTime;
            timeLeft = CONFIG.TOTAL_TIME - elapsedTime;

            if (timeLeft <= 0) {
                this.stop();
                timeLeft = 0;
                this.updateDisplay(timeLeft);
                if (this.onTimeUp) {
                    this.onTimeUp();
                }
            } else {
                this.updateDisplay(timeLeft);
            }
        }, CONFIG.TIMER_UPDATE_INTERVAL);
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    reset() {
        this.stop();
        this.updateDisplay(CONFIG.TOTAL_TIME);
    }

    getTimeLeft() {
        if (!this.startTime) return CONFIG.TOTAL_TIME;
        const elapsedTime = Date.now() - this.startTime;
        return Math.max(0, CONFIG.TOTAL_TIME - elapsedTime);
    }

    updateDisplay(timeLeft) {
        this.timerDisplay.innerText = formatTime(timeLeft);
    }
}