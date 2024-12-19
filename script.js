const cells = document.querySelectorAll('.cell');
const modeToggleBtn = document.querySelector('#modeToggleBtn');
const restartBtn = document.querySelector('#restartBtn');
const statusDisplay = document.querySelector('#status');
const modeDisplay = document.querySelector('#modeDisplay');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isUserVsComputer = true; 

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
];


function initializeGame() {
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.style.background = '';
        cell.addEventListener('click', () => handleCellClick(index));
    });
    board.fill('');
    currentPlayer = 'X';
    isGameActive = true;
    updateStatus();
}

function handleCellClick(index) {
    if (!isGameActive || board[index] !== '') return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].style.color = currentPlayer === 'X' ? '#1892EA' : '#A737FF';

    if (checkWinner()) {
        statusDisplay.textContent = `${currentPlayer} Wins!`;
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        statusDisplay.textContent = 'Draw!';
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

    if (isUserVsComputer && currentPlayer === 'O') {
        setTimeout(() => computerMove(), 500);
    }
}

function computerMove() {
    const bestMove = minimax(board, 'O').index;
    handleCellClick(bestMove);
}

function minimax(newBoard, player) {
    const emptyCells = newBoard.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);

    if (checkWinner(newBoard, 'X')) return { score: -10 };
    if (checkWinner(newBoard, 'O')) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    const moves = [];
    emptyCells.forEach(index => {
        const boardCopy = [...newBoard];
        boardCopy[index] = player;

        const result = minimax(boardCopy, player === 'O' ? 'X' : 'O');
        moves.push({ index, score: result.score });
    });

    return moves.reduce((best, move) =>
        (player === 'O' ? move.score > best.score : move.score < best.score) ? move : best
    );
}

function checkWinner(b = board, player = currentPlayer) {
    return winConditions.some(comb => comb.every(i => b[i] === player));
}

function updateStatus() {
    statusDisplay.textContent = `${currentPlayer}'s Turn`;
}

modeToggleBtn.addEventListener('click', () => {
    isUserVsComputer = !isUserVsComputer;
    modeDisplay.textContent = `Mode: ${isUserVsComputer ? 'User vs Computer' : 'User vs User'}`;
    modeToggleBtn.textContent = `Switch to ${isUserVsComputer ? 'User vs User' : 'User vs Computer'}`;
    restartGame();
});

function restartGame() {
    initializeGame();
    updateStatus();
}

restartBtn.addEventListener('click', restartGame);
initializeGame();
