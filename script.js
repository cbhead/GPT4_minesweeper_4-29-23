const boardSize = 8;
const mineCount = 10;
let gameBoard;

document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.querySelector('#game-board');
    initializeGame();
});

function initializeGame() {
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
            revealCell(adjacentCell);
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
        for (let c = col - 1; c <= col + 1; c++) {
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

    return adjacentCells;
}

function toggleFlag(cell) {
    if (cell.dataset.revealed === 'true') return;
    cell.dataset.flagged = cell.dataset.flagged === 'true' ? 'false' : 'true';
    cell.style.backgroundColor = cell.dataset.flagged === 'true' ? '#f6b26b' : '#3c8dbc';
    cell.textContent = cell.dataset.flagged === 'true' ? '🚩' : '';
}

function gameOver(cell) {
    cell.style.backgroundColor = '#d9534f';
    alert('Game over!');
    game
}
