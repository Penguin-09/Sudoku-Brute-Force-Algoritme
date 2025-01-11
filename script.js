// ! basic sudoku problem. Can be replaced later.
const sudoku = [
    2, 0, 6, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 6, 0, 0, 8, 1, 0, 0, 0, 2,
    0, 7, 0, 0, 0, 0, 3, 7, 0, 2, 9, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 8,
    0, 6, 0, 4, 0, 7, 0, 9, 0, 4, 0, 0, 0, 1, 4, 3, 6, 0, 5, 0, 8, 2, 9, 0, 2,
    8, 0, 3, 4, 7, 5,
];

// === DRAW THE SUDOKU BOARD ===
const sudokuBoard = document.getElementById("sudokuBoard");

let currentCell = 0;

for (let row = 0; row < 9; row++) {
    // Row div
    const cellRow = document.createElement("div");
    cellRow.className = "d-flex";

    for (let col = 0; col < 9; col++) {
        // Cell div
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = currentCell;

        // Add value to cell
        if (sudoku[currentCell] !== 0) {
            cell.textContent = sudoku[currentCell];
            cell.className = "cell preFilled";
        }

        // Add borders
        if (row % 3 == 0) {
            cell.style.marginTop = "2px";
        }

        if (row % 3 == 2) {
            cell.style.marginBottom = "2px";
        }

        if (col % 3 == 0) {
            cell.style.marginLeft = "2px";
        }

        if (col % 3 == 2) {
            cell.style.marginRight = "2px";
        }

        cellRow.appendChild(cell);
        currentCell++;
    }

    sudokuBoard.appendChild(cellRow);
}

// === CHECK IF A NUMBER IS VALID ===
function isValid(sudoku, currentIndex) {
    // Check row
    const rowStart = Math.floor(currentIndex / 9) * 9;
    for (let i = rowStart; i < rowStart + 9; i++) {
        if (i !== currentIndex && sudoku[i] === sudoku[currentIndex]) {
            return false;
        }
    }

    // Check column
    const colStart = currentIndex % 9;
    for (let i = colStart; i < 81; i += 9) {
        if (i !== currentIndex && sudoku[i] === sudoku[currentIndex]) {
            return false;
        }
    }

    // Check subgrid
    const subgridRowStart = Math.floor(currentIndex / 9 / 3) * 3;
    const subgridColStart = Math.floor((currentIndex % 9) / 3) * 3;
    for (let i = subgridRowStart * 9; i < subgridRowStart * 9 + 27; i += 9) {
        for (let j = i + subgridColStart; j < i + subgridColStart + 3; j++) {
            if (j !== currentIndex && sudoku[j] === sudoku[currentIndex]) {
                return false;
            }
        }
    }

    return true;
}

// === SOLVE THE SUDOKU ===
async function solveSudoku(sudoku) {
    document.getElementById("bottomElement").innerHTML = "Calculating...";

    if (await solveSudokuStep(sudoku)) {
        document.getElementById("bottomElement").innerHTML = "Solved!";
        // Update progress bar
        document.getElementById("progressBar").style.width = `100%`;
    } else {
        document.getElementById("bottomElement").innerHTML =
            "No solution found.";
    }
}

function sleep(ms) {
    // Thanks ChatGPT :)
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function solveSudokuStep(sudoku) {
    // Check if sudoku is solved
    if (!sudoku.includes(0)) {
        return true;
    }

    // Find the first empty cell
    for (let currentIndex = 0; currentIndex < sudoku.length; currentIndex++) {
        if (sudoku[currentIndex] == 0) {
            // Try to fill the cell with a number
            for (let currentNumber = 1; currentNumber <= 9; currentNumber++) {
                // Update cell
                document.getElementById(currentIndex).textContent =
                    currentNumber;
                // Update progress bar
                document.getElementById("progressBar").style.width = `${
                    (currentIndex / 81) * 100
                }%`;
                sudoku[currentIndex] = currentNumber;

                await sleep(1);

                // Check if the number is valid
                if (isValid(sudoku, currentIndex)) {
                    // Recursively solve the sudoku
                    if (await solveSudokuStep(sudoku)) {
                        return true;
                    }
                }

                // Reset the cell if the number is not valid
                sudoku[currentIndex] = 0;
                document.getElementById(currentIndex).textContent = "";
            }

            // If no number is valid, return false
            return false;
        }
    }
}

document
    .getElementById("solveButton")
    .addEventListener("click", () => solveSudoku(sudoku));
