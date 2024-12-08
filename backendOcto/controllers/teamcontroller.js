const jwt = require("jsonwebtoken");
const Participant = require("../models/Participant");
const Team = require("../models/Team");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

// Middleware pour valider les entrées
exports.validateJoinTeam = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("name").notEmpty().withMessage("Name is required"),
  body("teamPassword").notEmpty().withMessage("Team password is required"),
];

// Middleware pour vérifier les erreurs de validation
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.joinTeam = async (req, res) => {
  const { email, name, teamPassword } = req.body;

  try {
    // Trouver l'équipe et vérifier le mot de passe
    const team = await Team.findOne({ password: teamPassword });
    if (!team) {
      return res
        .status(404)
        .json({ message: "Team not found or incorrect password." });
    }

    let participant = await Participant.findOne({ email });
    // Vérifier si le participant existe déjà

    if (!participant) {
      // check if the team is full
      if (team.participants.length >= team.maxMembers) {
        return res.status(403).json({ message: "Team is full." });
      }
      // if not then create new one
      participant = new Participant({ name, email, teamId: team._id });
      await participant.save();

      // add participant to the team
      team.participants.push(participant._id);
      await team.save();
    }

    // Générer un JWT pour l'utilisateur
    const token = jwt.sign(
      { id: participant._id, teamId: team._id },
      process.env.JWT, // Assurez-vous que votre clé secrète est bien configurée dans votre .env
      { expiresIn: "24h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // En production, utilisez HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Répondre avec un message de succès et le token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while connecting to the team." });
  }
};
