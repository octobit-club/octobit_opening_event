const API_BASE_URL = "https://event-octobit.fun/api";

// Fonction pour récupérer l'ID du challenge depuis l'URL
function getChallengeId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("challengeId");
}

// Soumettre le flag
async function submitFlag(event) {
  event.preventDefault(); // Empêcher la soumission du formulaire par défaut

  const challengeId = getChallengeId();
  const flag = document.getElementById("password").value.trim(); // Récupérer la valeur du flag
  const responseMessage = document.getElementById("error-message"); // Élément pour afficher les messages

  // Vérification que le flag n'est pas vide
  if (!flag) {
    responseMessage.textContent = "Veuillez entrer un flag.";
    responseMessage.style.color = "red";
    return;
  }

  try {
    // Requête pour soumettre le flag
    const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/submit`, {
      method: "POST",
      credentials: "include", // Pour inclure le cookie du token
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flag }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Si la soumission est réussie, afficher le message et rediriger
      responseMessage.textContent = data.message || "Challenge corrigé avec succès !";
      responseMessage.style.color = "green";

      // Mettre à jour le statut du challenge pour qu'il soit "corrected"
      setTimeout(() => {
        window.location.href = "/quests.html"; // Rediriger vers la page des quêtes
      }, 2000); // Attendre 2 secondes avant la redirection
    } else if (response.status === 400) {
      // Si le flag est incorrect
      responseMessage.textContent = data.message || "Flag incorrect.";
      responseMessage.style.color = "red";
    } else {
      // Si une erreur inattendue se produit
      responseMessage.textContent = "Erreur lors de la soumission du challenge.";
      responseMessage.style.color = "red";
    }
  } catch (error) {
    console.error("Error submitting flag:", error);
    responseMessage.textContent = "Erreur réseau. Essayez de nouveau.";
    responseMessage.style.color = "red";
  }
}

// Attacher l'événement de soumission du formulaire
document.getElementById("login-form").addEventListener("submit", submitFlag);
