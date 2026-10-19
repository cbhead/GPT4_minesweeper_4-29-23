let boardSize;
let mineCount;
let gameBoard;
let consecutiveWins = 0;
let gameInProgress = false; // Add this line
let minesLeft;
let timerElement;
let minesLeftElement;
let timerInterval;
let elapsedTime = 0;

const difficulties = {
    easy: { size: 8, mines: 10 },
    medium: { size: 16, mines: 40 },
    hard: { size: 24, mines: 99 }
};

document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.querySelector('#game-board');
    timerElement = document.getElementById('timer');
    minesLeftElement = document.getElementById('mines-left');
    const startGameButton = document.getElementById('start-game');
    const restartGameButton = document.getElementById('restart-game');
    startGameButton.addEventListener('click', initializeGame);
    restartGameButton.addEventListener('click', initializeGame);
    addEventListeners();
    initializeGame();
});

function initializeGame() {
    gameInProgress = true; // Set gameInProgress to true when the game starts
    const difficulty = document.getElementById('difficulty').value;
    const settings = difficulties[difficulty];
    boardSize = settings.size;
    mineCount = settings.mines;
    gameBoard.innerHTML = '';

    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    generateCells();
    placeMines();

    minesLeft = mineCount;
    updateMinesLeft();
    resetTimer();
}

function generateCells() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.revealed = false;
        cell.dataset.mine = false;
        cell.dataset.flagged = false;
        cell.dataset.row = Math.floor(i / boardSize);
        cell.dataset.col = i % boardSize;
        gameBoard.appendChild(cell);
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const randomIndex = Math.floor(Math.random() * boardSize * boardSize);
        const cell = gameBoard.children[randomIndex];
        if (cell.dataset.mine === 'false') {
            cell.dataset.mine = true;
            minesPlaced++;
        }
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    if (timerElement) {
        timerElement.textContent = elapsedTime;
    }
    timerInterval = setInterval(() => {
        elapsedTime++;
        if (timerElement) {
            timerElement.textContent = elapsedTime;
        }
    }, 1000);
}

function updateMinesLeft() {
    if (minesLeftElement) {
        minesLeftElement.textContent = minesLeft;
    }
}

function addEventListeners() {
    gameBoard.addEventListener('click', (event) => {
        if (event.target.classList.contains('cell')) {
            if (event.target.dataset.mine === 'true') {
                gameOver(event.target);
            } else {
                revealCell(event.target);
                if (checkVictory()) {
                    victory();
                }
            }
        }
    });

    gameBoard.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('cell')) {
            toggleFlag(event.target);
        }
    });
}

function revealCell(cell) {
    if (cell.dataset.revealed === 'true' || cell.dataset.flagged === 'true') return;
    cell.dataset.revealed = 'true';
    cell.style.backgroundColor = '#333';

    const adjacentMineCount = getAdjacentMineCount(cell);
    if (adjacentMineCount > 0) {
        cell.textContent = adjacentMineCount;
    } else {
        getAdjacentCells(cell).forEach((adjacentCell) => {
            if (adjacentCell.dataset.revealed === 'false') {
                revealCell(adjacentCell);
            }
        });
    }
}

function getAdjacentMineCount(cell) {
    return getAdjacentCells(cell).filter((adjacentCell) => adjacentCell.dataset.mine === 'true').length;
}

function getAdjacentCells(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const adjacentCells = [];

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) { // Add the increment expression here
            if (
                r >= 0 &&
                r < boardSize &&
                c >= 0 &&
                c < boardSize &&
                !(r === row && c === col)
            ) {
                adjacentCells.push(gameBoard.children[r * boardSize + c]);
            }
        }
    }
    return adjacentCells; // Add the missing closing curly brace for the function
}


function toggleFlag(cell) {
    if (cell.dataset.revealed === 'true') return;
    if (cell.dataset.flagged === 'true') {
        cell.dataset.flagged = 'false';
        cell.style.backgroundColor = '#3c8dbc';
        cell.textContent = '';
        minesLeft++;
    } else {
        cell.dataset.flagged = 'true';
        cell.style.backgroundColor = '#f6b26b';
        cell.textContent = '🚩';
        minesLeft--;
    }
    updateMinesLeft();
}

function checkVictory() {
    const unclickedCells = Array.from(gameBoard.children).filter(
        (cell) => cell.dataset.revealed === 'false'
    );

    return unclickedCells.length === mineCount;
}

function gameOver(mineCell) {
    gameInProgress = false;
    clearInterval(timerInterval);
    mineCell.style.backgroundColor = '#d9534f';
    mineCell.textContent = '💣';

    Array.from(gameBoard.children).forEach((cell) => {
        if (cell.dataset.mine === 'true' && cell !== mineCell) {
            cell.textContent = '💣';
            cell.style.backgroundColor = '#333';
        }
    });

    consecutiveWins = 0;
    updateConsecutiveWins();
    setTimeout(() => {
        alert('Game Over! You hit a mine!');
        initializeGame();
    }, 1000);
}

function victory() {
    if (!gameInProgress) return; // Add this line to prevent multiple wins for a single victory

    gameInProgress = false; // Set gameInProgress to false when the player wins
    clearInterval(timerInterval);
    consecutiveWins++;
    updateConsecutiveWins();
    setTimeout(() => {
        alert('Congratulations! You won!');
        initializeGame();
    }, 1000);
}


function updateConsecutiveWins() {
    const winsCount = document.getElementById('wins-count');
    winsCount.textContent = consecutiveWins;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAdjacentCells,
        __setBoard: (size, boardElement) => {
            boardSize = size;
            gameBoard = boardElement;
        }
    };
}

