// Fonctions utilitaires
export function decodeHTML(html) {
    const txt = document.createElement('div');
    txt.innerHTML = html;
    return txt.textContent;
}

export function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function formatTime(milliseconds) {
    return (milliseconds / 1000).toFixed(2);
}

export function calculateScore(timeLeft, totalTime) {
    return Math.floor((timeLeft / totalTime) * 1000);
}

export function getCurrentDate() {
    return new Date().toLocaleDateString();
}