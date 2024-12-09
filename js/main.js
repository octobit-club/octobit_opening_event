const API_BASE_URL = "https://event-octobit.fun/api";

// Function to fetch challenges and dynamically update buttons
async function fetchChallenges() {
  try {
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      method: "GET",
      credentials: "include", // To include any authentication cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      // Redirect to login if not authenticated
      window.location.href = "/login.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch challenges: ${response.statusText}`);
    }

    const challenges = await response.json(); // Array of challenge objects
    updateChallengeButtons(challenges); // Update buttons with challenge data
    checkAllChallengesCorrected(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
  }
}

// Function to update buttons based on challenge data
function updateChallengeButtons(challenges) {
  const challengeButtons = document.querySelectorAll(".Challenge-btn");

  // Loop through the buttons and link them to the corresponding challenge
  challenges.forEach((challenge, index) => {
    const challengeButton = challengeButtons[index];
    if (challengeButton) {
      // Update button text
      challengeButton.textContent = `def ${challenge.name}()`;

      // Set button style based on status
      challengeButton.classList.remove("glow-red", "glow-green");
      if (challenge.status === "corrected") {
        challengeButton.classList.add("glow-green");
        challengeButton.style.pointerEvents = "none"; // Disable the button if corrected
      } else {
        challengeButton.classList.add("glow-red");
        challengeButton.style.pointerEvents = "auto"; // Enable the button
      }

      // Add click event to redirect to quest page based on index
      const questPage = `quest${index + 1}.html`; // File names follow the format quest1.html, quest2.html, etc.
      challengeButton.addEventListener("click", () => {
        window.location.href = `${questPage}`;
      });
    }
  });
}

// Call fetchChallenges when the DOM is loaded
document.addEventListener("DOMContentLoaded", fetchChallenges);

function checkAllChallengesCorrected(challenges) {
  const saveButton = document.getElementById("save-world-btn"); // Assuming you have an id for the button
  const allCorrected = challenges.every(challenge => challenge.status === "corrected");

  if (allCorrected) {
    saveButton.disabled = false; // Enable the button if all challenges are corrected
    saveButton.classList.remove("cursur_no"); // Remove the cursor-no class
    saveButton.addEventListener("click", () => {
      window.location.href = "you_saved_the_world.html"; // Redirect when clicked
    });
  } else {
    saveButton.disabled = true; // Keep the button disabled if not all challenges are corrected
    saveButton.classList.add("cursur_no"); // Ensure the cursor is disabled
  }
}
function checkAuthCookieForSaveTheWorld() {
  const cookie = document.cookie;
  
  // Vérifie si le cookie d'authentification (par exemple, "auth_token") est présent
  if (!cookie.includes("token")) {
    // Si le cookie n'est pas trouvé, rediriger vers la page de connexion
    window.location.href = "/login.html";
  }
}

// Appeler la fonction dès que le DOM est chargé
document.addEventListener("DOMContentLoaded", function() {
  // Vérifiez ici si vous êtes sur la page "Save the World"
  if (window.location.pathname === "/you_saved_the_world.html") {
    checkAuthCookieForSaveTheWorld();
  }
});