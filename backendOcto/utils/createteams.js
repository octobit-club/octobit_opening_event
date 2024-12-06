require("dotenv").config(); // Charger les variables d'environnement
const mongoose = require("mongoose");
const Team = require("../backend/models/Team"); // Assurez-vous que le chemin est correct

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à MongoDB réussie.");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    process.exit(1); // Arrêter le script si la connexion échoue
  }
};

// Création des équipes
const createTeams = async () => {
  const teams = [
    { name: "Octobit Alpha", password: "Alpha7/l9" },
    { name: "Octobit Beta", password: "Beta1:b0" },
    { name: "Octobit Gamma", password: "Gamma0#m4" },
    { name: "Octobit Delta", password: "Delta8&o5" },
    { name: "Octobit Epsilon", password: "Epsilon2@q8" },
  ];

  try {
    // Vérifiez si les équipes existent déjà
    const existingTeams = await Team.countDocuments();
    if (existingTeams > 0) {
      console.log("Les équipes existent déjà. Pas besoin de les recréer.");
      return;
    }

    // Insérer les équipes
    await Team.insertMany(teams);
    console.log("Équipes insérées avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'insertion des équipes:", error);
  } finally {
    mongoose.connection.close(); // Fermer la connexion après l'opération
  }
};

// Exécuter le script
const run = async () => {
  await connectDB();
  await createTeams();
};

run();
