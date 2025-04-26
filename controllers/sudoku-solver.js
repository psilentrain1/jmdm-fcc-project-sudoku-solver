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
    for (let r = 0; r < 9; r++) {
      if (puzzleArray[r][coord[1]] === String(value)) return false;
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

    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        if (puzzleArray[r][c] === String(value)) return false;
      }
    }

    return true;
  }

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
