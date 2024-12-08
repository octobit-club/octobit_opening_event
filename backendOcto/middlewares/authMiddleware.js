const jwt = require("jsonwebtoken");
const Participant = require("../models/Participant"); // Modèle pour récupérer les participants
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT); // 'your_secret_key' doit correspondre à celle utilisée pour signer le token
    const participant = await Participant.findById(decoded.id); // Récupérer l'utilisateur à partir de l'ID dans le token

    if (!participant) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    // Ajouter l'utilisateur dans l'objet `req` pour un accès ultérieur
    req.participant = participant;
    next(); // L'utilisateur est authentifié, on passe à la suite (route suivante)
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
