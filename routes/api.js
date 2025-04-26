"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) return res.status(400).json({ error: "Required field missing" });
    if (SudokuSolver.validate(puzzle) !== true) return res.status(400).json({ error: SudokuSolver.validate(puzzle).error });
  });
};
