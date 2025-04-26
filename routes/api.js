"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    if (SudokuSolver.validate(puzzle) !== true) return res.status(400).json({ error: SudokuSolver.validate(puzzle).error });

    const rowValid = solver.checkRowPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value);
    const colValid = solver.checkColPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value);
    const regionValid = solver.checkRegionPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value);

    if (!rowValid || !colValid || !regionValid) {
      const conflict = [];
      if (!rowValid) conflict.push("row");
      if (!colValid) conflict.push("column");
      if (!regionValid) conflict.push("region");
      return res.status(200).json({ valid: false, conflict });
    }

    return res.status(200).json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) return res.status(400).json({ error: "Required field missing" });
    if (SudokuSolver.validate(puzzle) !== true) return res.status(400).json({ error: SudokuSolver.validate(puzzle).error });
  });
};
