const express = require("express");
const {
  submitAndSolveChallenge,
} = require("../controllers/challengecontroller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
// post request to check the flag of the chalenge
router.post("/:challengeId/submit", authMiddleware, submitAndSolveChallenge); // tested

module.exports = router;
