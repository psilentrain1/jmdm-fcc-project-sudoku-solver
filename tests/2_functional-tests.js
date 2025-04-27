const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  const validString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const invalidString = "1.5..2.84..63.12.7.2..5.af..9..1....8.2.3674.3.7.2g.9$47...8..1..16....926914.37.";
  suite("POST /api/solve", function () {});
  suite("POST /api/check", function () {
    test("Check a puzzle placement with all fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "A2",
          value: 3,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body.valid, true, "Valid placement should return true");
          assert.notProperty(res.body, "conflict", "No conflicts should be present");
          done();
        });
    });
    test("Check a puzzle placement with single placement conflict", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "A2",
          value: 9,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body.valid, false, "Valid placement should return false");
          assert.property(res.body, "conflict", "Conflict should be present");
          assert.isArray(res.body.conflict, "Conflict should be an array");
          assert.equal(res.body.conflict.length, 1, "Conflict array should have length 1");
          assert.equal(res.body.conflict[0], "column", "Conflict should be in the column");
          done();
        });
    });
    test("Check a puzzle placement with multiple placement conflicts", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "A2",
          value: 6,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body.valid, false, "Valid placement should return false");
          assert.property(res.body, "conflict", "Conflict should be present");
          assert.isArray(res.body.conflict, "Conflict should be an array");
          assert.equal(res.body.conflict.length, 2, "Conflict array should have length 2");
          assert.include(res.body.conflict, "column", "Conflict should be in the column");
          assert.include(res.body.conflict, "region", "Conflict should be in the region");
          done();
        });
    });
    test("Check a puzzle placement with all placement conflicts", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "B2",
          value: 2,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.body.valid, false, "Valid placement should return false");
          assert.property(res.body, "conflict", "Conflict should be present");
          assert.isArray(res.body.conflict, "Conflict should be an array");
          assert.equal(res.body.conflict.length, 3, "Conflict array should have length 3");
          assert.include(res.body.conflict, "row", "Conflict should be in the row");
          assert.include(res.body.conflict, "column", "Conflict should be in the column");
          assert.include(res.body.conflict, "region", "Conflict should be in the region");
          done();
        });
    });
    test("Check a puzzle placement with missing required fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          value: 2,
        })
        .end(function (err, res) {
          assert.equal(res.status, 400, "Status should be 400");
          assert.notProperty(res.body, "valid", "Valid should not be present");
          assert.property(res.body, "error", "Error should be present");
          assert.equal(res.body.error, "Required field(s) missing", "Error message should be 'Required field(s) missing'");
          done();
        });
    });
    test("Check a puzzle placement with invalid characters", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: invalidString,
          coordinate: "A2",
          value: 3,
        })
        .end(function (err, res) {
          assert.equal(res.status, 400, "Status should be 400");
          assert.notProperty(res.body, "valid", "Valid should not be present");
          assert.property(res.body, "error", "Error should be present");
          assert.equal(res.body.error, "Invalid characters in puzzle", "Error message should be 'Invalid characters in puzzle'");
          done();
        });
    });
    test("Check a puzzle placement with incorrect length", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: invalidString.slice(0, 75),
          coordinate: "A2",
          value: 3,
        })
        .end(function (err, res) {
          assert.equal(res.status, 400, "Status should be 400");
          assert.notProperty(res.body, "valid", "Valid should not be present");
          assert.property(res.body, "error", "Error should be present");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
            "Error message should be 'Expected puzzle to be 81 characters long'"
          );
          done();
        });
    });
    test("Check a puzzle placement with invalid placement coordinate", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "J5",
          value: 2,
        })
        .end(function (err, res) {
          assert.equal(res.status, 400, "Status should be 400");
          assert.notProperty(res.body, "valid", "Valid should not be present");
          assert.property(res.body, "error", "Error should be present");
          assert.equal(res.body.error, "Invalid coordinate", "Error message should be 'Invalid coordinate'");
          done();
        });
    });
    test("Check a puzzle placement with invalid placement value", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "J5",
          value: 12,
        })
        .end(function (err, res) {
          assert.equal(res.status, 400, "Status should be 400");
          assert.notProperty(res.body, "valid", "Valid should not be present");
          assert.property(res.body, "error", "Error should be present");
          assert.equal(res.body.error, "Invalid value", "Error message should be 'Invalid value'");
          done();
        });
    });
  });
});
