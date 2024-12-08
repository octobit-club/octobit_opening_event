const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Participant = require("../models/Participant");
const ChallengeProgress = require("../models/ChallengeProgress");

// Soumettre une solution à un challenge

exports.submitAndSolveChallenge = async (req, res) => {
  const { challengeId } = req.params; // Challenge ID from URL
  const  flag  = req.body.correctFlag;
  const participantId = req.participant?.id; // Extract from middleware
  const teamId = req.participant?.teamId;
  console.log("Request Body:", req.body);
  console.log("Flag Submitted:", flag);
  console.log("Challenge ID:", challengeId);
  console.log("Participant Info:", req.participant);
  try {
    // 1. Retrieve the challenge from the database
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge introuvable." });
    }

    // 2. Retrieve the team's progress for the challenge
    let progress = await ChallengeProgress.findOne({ teamId, challengeId });

    // 3. If already solved, return an error
    if (progress && progress.status === "corrected") {
      return res
        .status(400)
        .json({ message: "Ce challenge a déjà été corrigé." });
    }

    // 4. Validate the submitted flag    console.log(flag.trim());
    console.log(flag);
    
    if (flag === challenge.correctFlag.trim()) {
      // Update or create a progress entry
      if (!progress) {
        progress = new ChallengeProgress({
          teamId,
          challengeId,
          status: "corrected",
          solvedBy: participantId,
        });
      } else {
        progress.status = "corrected";
        progress.solvedBy = participantId;
      }
      await progress.save();

      // 5. (Optional) Update participant's completed challenges
      await Participant.findByIdAndUpdate(participantId, {
        $push: { completedChallenges: challengeId },
      });

      // 6. Return a success response
      return res.status(200).json({
        message: "Challenge corrigé avec succès.",
        progress,
      });
    } else {
      // Incorrect flag
      return res.status(400).json({ message: "Flag incorrect." });
    }
  } catch (error) {
    console.error("Error submitting challenge:", error);
    return res
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
