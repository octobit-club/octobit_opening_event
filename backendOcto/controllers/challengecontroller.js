const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Participant = require("../models/Participant");
const ChallengeProgress = require("../models/ChallengeProgress");

// Soumettre une solution à un challenge

exports.submitAndSolveChallenge = async (req, res) => {
  const { challengeId } = req.params; // Challengeid from url
  const { flag } = req.body;
  const participantId = req.participant.id; // (via middleware)
  const teamId = req.participant.teamId; 

  try {
    // 1. Récupérer le challenge de la base
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge introuvable." });
    }

    // 2. Vérifier la progression de l'équipe pour ce challenge
    let progress = await ChallengeProgress.findOne({ teamId, challengeId });

    // 3. Si déjà corrigé, retourner une erreur
    if (progress && progress.status === "corrected") {
      return res
        .status(400)
        .json({ message: "Ce challenge a déjà été corrigé." });
    }

    // 4. Vérifier si le flag soumis est correct
    if (flag === challenge.correctFlag) {
      // Mettre à jour ou créer une entrée de progression
      if (!progress) {
        // Si la progression n'existe pas, la créer
        progress = new ChallengeProgress({
          teamId,
          challengeId,
          status: "corrected",
          solvedBy: participantId,
        });
      } else {
        // Sinon, mettre à jour l'entrée existante
        progress.status = "corrected";
        progress.solvedBy = participantId;
      }
      await progress.save();

      // 5. (Optionnel) Mettre à jour les données du participant
      await Participant.findByIdAndUpdate(participantId, {
        $push: { completedChallenges: challengeId },
      });

      // 6. Retourner une réponse indiquant le succès
      return res
        .status(200)
        .json({ message: "Challenge corrigé avec succès.", progress });
    } else {
      // Flag incorrect
      return res.status(400).json({ message: "Flag incorrect." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la soumission du challenge." });
  }
};

// Récupérer les challenges et leur statut pour une équipe spécifique

exports.getChallengesWithProgress = async (req, res) => {
  try {
    // Récupérer l'utilisateur connecté
    const participantId = req.participant.id;

    // Trouver l'équipe de l'utilisateur
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }
    const teamId = participant.teamId;

    // Récupérer tous les challenges
    const challenges = await Challenge.find();

    // Récupérer la progression de l'équipe
    const progress = await ChallengeProgress.find({ teamId });

    // Combiner les données
    const challengesWithProgress = challenges.map((challenge) => {
      const progressForChallenge = progress.find(
        (p) => p.challengeId.toString() === challenge._id.toString()
      );
      return {
        id: challenge._id,
        name: challenge.name,
        status: progressForChallenge
          ? progressForChallenge.status
          : "notcorrected",
        solvedBy: progressForChallenge ? progressForChallenge.solvedBy : null,
      };
    });

    // Renvoyer la réponse
    res.status(200).json(challengesWithProgress);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des challenges." });
  }
};
