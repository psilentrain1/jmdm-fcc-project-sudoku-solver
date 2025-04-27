"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) return res.status(400).json({ error: "Required field(s) missing" });
    if (isNaN(Number(req.body.value))) return res.status(400).json({ error: "Invalid value" });
    if (Number(req.body.value) < 1 || Number(req.body.value) > 9) return res.status(400).json({ error: "Invalid value" });
    if (req.body.coordinate.length !== 2) return res.status(400).json({ error: "Invalid coordinate" });
    if (req.body.coordinate[0].toUpperCase() < "A" || req.body.coordinate[0].toUpperCase() > "I")
      return res.status(400).json({ error: "Invalid coordinate" });
    if (Number(req.body.coordinate[1]) < 1 || Number(req.body.coordinate[1]) > 9)
      return res.status(400).json({ error: "Invalid coordinate" });
    if (solver.validate(req.body.puzzle) !== true) return res.status(400).json({ error: solver.validate(req.body.puzzle).error });

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

    if (!puzzle || puzzle === "") return res.status(400).json({ error: "Required field missing" });
    if (solver.validate(puzzle) !== true) return res.status(400).json({ error: solver.validate(puzzle).error });

    const solution = solver.solve(puzzle);
    if (solution.error) return res.status(400).json({ error: solution.error });
    if (solution.length !== 81) return res.status(400).json({ error: "Puzzle cannot be solved" });
    return res.status(200).json({ solution: solution });
  });
};
