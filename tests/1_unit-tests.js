const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

suite("Unit Tests", () => {
  const validString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const invalidString = "1.5..2.84..63.12.7.2..5.af..9..1....8.2.3674.3.7.2g.9$47...8..1..16....926914.37.";
  suite("SudokuSolver.validate()", () => {
    test("Valid puzzle string", function () {
      solver = new Solver();
      const result = solver.validate(validString);
      assert.isTrue(result, "Valid string should validate true");
    });

    test("Invalid puzzle string", function () {
      solver = new Solver();
      const result = solver.validate(invalidString);
      assert.equal(result.error, "Invalid characters in puzzle", "Invalid string should return error message");
    });

    test("Puzzle string that is not 81 characters long", function () {
      solver = new Solver();
      const result = solver.validate(validString.slice(0, 75));
      assert.equal(
        result.error,
        "Expected puzzle to be 81 characters long",
        "String that is not 81 characters long should return error message"
      );
    });
  });
  suite("SudokuSolver.checkRowPlacement()", function () {
    test("Valid row placement", function () {
      solver = new Solver();
      const result = solver.checkRowPlacement(validString, "A", 2, 3);
      assert.isTrue(result, "Valid row placement should return true");
    });

    test("Invalid row placement", function () {
      solver = new Solver();
      const result = solver.checkRowPlacement(validString, "A", 2, 8);
      assert.isFalse(result, "Invalid row placement should return false");
    });
  });
  suite("SudokuSolver.checkColPlacement()", function () {
    test("Valid col placement", function () {
      solver = new Solver();
      const result = solver.checkColPlacement(validString, "A", 2, 3);
      assert.isTrue(result, "Valid col placement should return true");
    });

    test("Invalid col placement", function () {
      solver = new Solver();
      const result = solver.checkColPlacement(validString, "A", 2, 9);
      assert.isFalse(result, "Invalid col placement should return false");
    });
  });
  suite("SudokuSolver.checkRegionPlacement()", function () {
    test("Valid region placement", function () {
      solver = new Solver();
      const result = solver.checkRegionPlacement(validString, "A", 2, 3);
      assert.isTrue(result, "Valid region placement should return true");
    });

    test("Invalid region placement", function () {
      solver = new Solver();
      const result = solver.checkRegionPlacement(validString, "A", 2, 6);
      assert.isFalse(result, "Invalid region placement should return false");
    });
  });
  // TODO: Implement the solve() method in SudokuSolver and add tests for it
  suite("SudokuSolver.solve()", function () {
    // test("Valid puzzle strings pass the solver", function(){})
    // test("Invalid puzzle strings fail the solver", function(){})
    // test("Solver returns the expected solution for an incomplete puzzle", function(){})
  });
});
