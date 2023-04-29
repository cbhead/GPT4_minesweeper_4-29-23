let boardSize;
let mineCount;
let gameBoard;
let consecutiveWins = 0;

document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.querySelector('#game-board');
    const startGameButton = document.getElementById('start-game');
    startGameButton.addEventListener('click', () => {
        initializeGame();
    });  initializeGame(); // Add this line to start the game when the page loads
});


function initializeGame() {
    const boardSizeInput = document.getElementById('board-size');
    const mineCountInput = document.getElementById('mine-count');
    boardSize = Math.min(50, parseInt(boardSizeInput.value));
    mineCount = Math.min(boardSize * boardSize - 1, parseInt(mineCountInput.value));
    gameBoard.innerHTML = '';

    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    generateCells();
    placeMines();
    addEventListeners();
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
        for (let c = col - 1; c <= col + 1; c
        ) {
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
}
return adjacentCells;
    }

function toggleFlag(cell) {
    if (cell.dataset.revealed === 'true') return;
    cell.dataset.flagged = cell.dataset.flagged === 'true' ? 'false' : 'true';
    cell.style.backgroundColor = cell.dataset.flagged === 'true' ? '#f6b26b' : '#3c8dbc';
    cell.textContent = cell.dataset.flagged === 'true' ? '🚩' : '';
}

function checkVictory() {
    const unclickedCells = Array.from(gameBoard.children).filter(
        (cell) => cell.dataset.revealed === 'false'
    );

    return unclickedCells.length === mineCount;
}

function gameOver(mineCell) {
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
