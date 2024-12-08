const API_BASE_URL = "https://event-octobit.fun/api";
// Fetch challenges and update dynamically
async function fetchChallenges() {
  try {
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", response.status);

    if (response.status === 401) {
      // Redirection si l'utilisateur n'est pas authentifié
      window.location.href = "/login.html";
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch challenges: ${response.statusText}`);
    }

    const challenges = await response.json();
    updateChallenges(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
  }
}

// Update challenges on the page
// Update challenges on the page
function updateChallenges(challenges) {
  challenges.forEach((challenge, index) => {
    const challengeButton = document.querySelector(
      `.Challenge-btn:nth-child(${index + 1})`
    );

    if (challengeButton) {
      challengeButton.textContent = `def ${challenge.name}()`; // Set challenge button text
      challengeButton.classList.remove("glow-red", "glow-green"); // Remove previous glow classes
      if (challenge.status === "corrected") {
        challengeButton.classList.add("glow-green");
        challengeButton.style.pointerEvents = "none";
      } else {
        challengeButton.classList.add("glow-red");
        challengeButton.style.pointerEvents = "auto";
      }
      challengeButton.setAttribute("data-challenge-id", challenge._id);
      if (challenge.status !== "corrected") {
        challengeButton.setAttribute(
          "onclick",
          `window.location.href='quest${challenge.name}.html?challengeId=${challenge._id}';`
        );
      }
    }
  });
}
// Fetch and update challenges when the DOM loads
document.addEventListener("DOMContentLoaded", fetchChallenges);

// submit challenge function
// document.addEventListener("DOMContentLoaded", function () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const challengeId = urlParams.get("challengeId");
//   if (challengeId) {
//     document
//       .getElementById("login-form")
//       .addEventListener("submit", async function (event) {
//         event.preventDefault();

//         const flag = document.querySelector("input[name='flag']");
//         submitChallenge(challengeId, flag);
//       });
//   }
// });
// submit challenge function
// async function submitChallenge(challengeId, flag) {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/challenges/${challengeId}/submit`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ flag }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       alert(`Error: ${errorData.message || "Something went wrong"}`);
//       return;
//     }

//     const result = await response.json();
//     if (result.message === "Challenge corrigé avec succès.") {
//       alert("Challenge solved successfully!");
//       window.location.href = "challenges.html";
//     } else {
//       alert(result.message || "Flag is incorrect.");
//     }
//   } catch (error) {
//     console.error("Error submitting challenge:", error);
//     alert("An error occurred while submitting the challenge.");
//   }
// }
