function charToNum(char) {
  if (typeof char !== "string" || char.length !== 1) return NaN;
  if (char === ".") return 0;

  const charCode = char.toUpperCase().charCodeAt(0);
  if (charCode >= 65 && charCode <= 90) {
    return charCode - 64;
  }
}

function numToChar(num) {
  if (typeof num !== "number") return "";
  if (num === 0) return ".";
  if (num >= 1 && num <= 9) {
    return String.fromCodePoint(num + 64);
  }
}

function puzzleStringToArray(puzzleString) {
  const newPuzzleString = puzzleString.split("");
  const puzzleArray = [];

  for (let r = 0; r < 9; r++) {
    const row = [];
    for (let c = 0; c < 9; c++) {
      row.push(newPuzzleString.shift());
    }
    puzzleArray.push(row);
  }
  return puzzleArray;
}

class SudokuSolver {
  validate(puzzleString) {
    const regex = /^[.1-9]{81}$/;
    if (puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };
    if (!regex.test(puzzleString)) return { error: "Invalid characters in puzzle" };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowConverted = charToNum(row);
    const puzzleArray = puzzleStringToArray(puzzleString);
    const coord = [rowConverted - 1, column - 1];

    if (puzzleArray[coord[0]][coord[1]] === String(value)) return true;
    if (puzzleArray[coord[0]][coord[1]] !== ".") return false;
    if (puzzleArray[coord[0]].includes(String(value))) return false;

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowConverted = charToNum(row);
    const puzzleArray = puzzleStringToArray(puzzleString);
    const coord = [rowConverted - 1, column - 1];

    if (puzzleArray[coord[0]][coord[1]] === String(value)) return true;
    if (puzzleArray[coord[0]][coord[1]] !== ".") return false;
    for (let row = 0; row < 9; row++) {
      if (puzzleArray[row][coord[1]] === String(value)) return false;
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowConverted = charToNum(row);
    const puzzleArray = puzzleStringToArray(puzzleString);
    const coord = [rowConverted - 1, column - 1];

    if (puzzleArray[coord[0]][coord[1]] === String(value)) return true;
    if (puzzleArray[coord[0]][coord[1]] !== ".") return false;

    const regionRowStart = Math.floor(coord[0] / 3) * 3;
    const regionColStart = Math.floor(coord[1] / 3) * 3;

    for (let row = regionRowStart; row < regionRowStart + 3; row++) {
      for (let col = regionColStart; col < regionColStart + 3; col++) {
        if (puzzleArray[row][col] === String(value)) return false;
      }
    }

    return true;
  }

  solve(puzzleString) {
    if (!puzzleString || puzzleString === "") return { error: "Required field missing" };
    if (puzzleString.length > 2 && puzzleString.length < 81) {
      const missingChars = 81 - puzzleString.length;
      puzzleString = puzzleString + ".".repeat(missingChars);
    }

    const validation = this.validate(puzzleString);
    if (validation !== true) return validation;

    const puzzle = puzzleStringToArray(puzzleString);

    const solver = (puzzle) => {
      const emptyCell = findEmptyCell(puzzle);
      if (!emptyCell) return true;

      const [row, col] = emptyCell;

      // Try numbers 1-9
      for (let num = 1; num <= 9; num++) {
        const rowLetter = String.fromCharCode(row + 65);

        // Check if valid
        if (
          this.checkRowPlacement(puzzleString, rowLetter, col + 1, num) &&
          this.checkColPlacement(puzzleString, rowLetter, col + 1, num) &&
          this.checkRegionPlacement(puzzleString, rowLetter, col + 1, num)
        ) {
          // Place the number in the cell
          puzzle[row][col] = String(num);

          // Update the puzzle string
          puzzleString = puzzle.map((row) => row.join("")).join("");

          // Recursively try to solve the rest of the puzzle
          if (solver(puzzle)) {
            return true;
          }

          // backtrack
          puzzle[row][col] = ".";
          puzzleString = puzzle.map((row) => row.join("")).join("");
        }
      }

      // No solution found
      return false;
    };

    const findEmptyCell = (puzzle) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] === ".") {
            return [row, col];
          }
        }
      }
      return null;
    };

    // Attempt to solve
    const solutionFound = solver(puzzle);

    if (solutionFound) {
      return puzzle.map((row) => row.join("")).join("");
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }
}

module.exports = SudokuSolver;
