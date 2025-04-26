class SudokuSolver {
  validate(puzzleString) {
    const regex = /^[.1-9]{81}$/;
    if (puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };
    if (!regex.test(puzzleString)) return { error: "Invalid characters in puzzle" };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
