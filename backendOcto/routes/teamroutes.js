const express = require("express");
const { joinTeam } = require("../controllers/teamcontroller");
const {
  getChallengesWithProgress,
} = require("../controllers/challengecontroller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// join route
router.post("/join", joinTeam); // tested
router.get("/challenges", authMiddleware, getChallengesWithProgress); //tested

module.exports = router;
