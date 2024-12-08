const API_BASE_URL = "http://localhost:3001/api";

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
        window.location.href = `${questPage}?challengeId=${challenge._id}`;
      });
    }
  });
}

// Call fetchChallenges when the DOM is loaded
document.addEventListener("DOMContentLoaded", fetchChallenges);

