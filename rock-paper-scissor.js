const score = JSON.parse(localStorage.getItem('score')) || {
    wins: 0,
    losses: 0,
    tie: 0
};

function fireConfetti() {
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
    });
}

updateScore();
ri
let isAutoPlaying = false;
let intervalId;
let keyInfoShow = false;

//  KEYBOARD CONTROLS
document.body.addEventListener('keydown', (event) => {
    if (event.key === 'r') playGame('rock');
    else if (event.key === 'p') playGame('paper');
    else if (event.key === 's') playGame('scissors');
    else if (event.key === 'a') autoplay();
    else if (event.key === 'Backspace') resetScore();
});

//  BUTTON EVENTS
document.querySelector('.js-rock-button')
    .addEventListener('click', () => playGame('rock'));

document.querySelector('.js-paper-button')
    .addEventListener('click', () => playGame('paper'));

document.querySelector('.js-scissors-button')
    .addEventListener('click', () => playGame('scissors'));

document.querySelector('.reset-score-button')
    .addEventListener('click', resetScore);

document.querySelector('.autoplay-button')
    .addEventListener('click', autoplay);

//  KEY INFO
document.querySelector('.key-info-button')
    .addEventListener('click', () => {
        const keyInfoDiv = document.querySelector('.key-info');

        if (keyInfoShow) {
            keyInfoDiv.innerHTML = '';
            keyInfoShow = false;
        } else {
            keyInfoDiv.innerHTML = `
                <p><b>Keyboard Controls:</b></p>
                <p>R → Rock</p>
                <p>P → Paper</p>
                <p>S → Scissors</p>
                <p>A → Auto Play</p>
                <p>Backspace → Reset</p>
            `;
            keyInfoShow = true;
        }
    });

//  RESET SCORE
function resetScore() {
    score.wins = 0;
    score.losses = 0;
    score.tie = 0;
    localStorage.removeItem('score');
    updateScore();
}

// AUTO PLAY
function autoplay() {
    if (!isAutoPlaying) {
        isAutoPlaying = true;
        intervalId = setInterval(() => {
            const playerMove = getMove();
            playGame(playerMove);
        }, 1000);

        document.querySelector('.autoplay-button').innerText = 'Stop Playing';
    } else {
        isAutoPlaying = false;
        clearInterval(intervalId);
        document.querySelector('.autoplay-button').innerText = 'Auto Play';
    }
}

//  RANDOM MOVE
function getMove() {
    const random = Math.random();

    if (random < 1 / 3) return 'rock';
    else if (random < 2 / 3) return 'paper';
    else return 'scissors';
}

// MAIN GAME FUNCTION
function playGame(move) {
    const compMove = getMove();

    let result = '';

    if (move === 'rock') result = compare(compMove, 'rock', 'paper');
    else if (move === 'paper') result = compare(compMove, 'paper', 'scissors');
    else result = compare(compMove, 'scissors', 'rock');

    localStorage.setItem('score', JSON.stringify(score));
    updateScore();

    // RESULT TEXT + ANIMATION
    const resultDiv = document.querySelector('.js-result');
    resultDiv.innerHTML = result;

    resultDiv.classList.add("show-result");
    setTimeout(() => {
        resultDiv.classList.remove("show-result");
    }, 500);

    //  WIN → Confetti
    if (result.includes("Win")) {
        fireConfetti();
        resultDiv.classList.add("win-glow");
        setTimeout(() => {
            resultDiv.classList.remove("win-glow");
        }, 600);
    }

    //  LOSE → Shake animation
    if (result.includes("Lose")) {
    resultDiv.classList.add("shake");

    setTimeout(() => {
        resultDiv.classList.remove("shake");
    }, 400);
}


    //  COMPUTER THINKING EFFECT
    const moveDisplay = document.querySelector('.move');
    let i = 0;
    const choices = ['rock', 'paper', 'scissors'];

    const interval = setInterval(() => {
        moveDisplay.innerHTML = `Computer choosing... ${choices[i % 3]}`;
        i++;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);

        moveDisplay.innerHTML = `
            You :  
            <img src="images/${move}-emoji.png" class="move-icon">  
            <img src="images/${compMove}-emoji.png" class="move-icon"> 
            : Computer
        `;
    }, 700);
}

// COMPARE LOGIC
function compare(compMove, tie, lose) {
    if (compMove === tie) {
        score.tie++;
        return '🤝 Tie!';
    } else if (compMove === lose) {
        score.losses++;
        return '😢 You Lose!';
    } else {
        score.wins++;
        return '🎉 You Win!';
    }
}


// UPDATE SCOREBOARD (FIXED)
function updateScore() {
    document.getElementById('user-score').innerText = score.wins;
    document.getElementById('comp-score').innerText = score.losses;
    document.getElementById('tie-score').innerText = score.tie;
}

//  THEME TOGGLE
const themeToggleBtn = document.getElementById('themeToggle');

themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.toggle('light-mode')) {
        themeToggleBtn.textContent = 'Switch to Dark Mode';
    } else {
        themeToggleBtn.textContent = 'Switch to Light Mode';
    }
});