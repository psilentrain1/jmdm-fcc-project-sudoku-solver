const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

suite("Unit Tests", () => {
  suite("SudokuSolver.validate()", () => {
    const validString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const invalidString = "1.5..2.84..63.12.7.2..5.af..9..1....8.2.3674.3.7.2g.9$47...8..1..16....926914.37.";

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
});
