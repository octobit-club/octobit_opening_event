const API_BASE_URL = "https://event-octobit.fun/api";
async function joinTeamFrontend(email, name, teamPassword) {

  try {
    const response = await fetch(`${API_BASE_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, teamPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Styled success alert
      Swal.fire({
        icon: "success",
        title: "🎉 Joined Successfully!",
        html: `
          <div style="font-size: 14px; color: #ff0000; /* Base color of the text */
          text-shadow: 0 0 10px red, /* Inner glow */ 0 0 20px red,
            /* Outer glow */ 0 0 30px red, 0 0 40px red, 0 0 50px red, 0 0 60px red; margin: "20px";padding: "20px"; font-weight: bold;">
            Welcome to the team!
          </div>
          
        `,
        background: "#000000", // White background
        confirmButtonColor: "#1a73e8", // Nightlight blue button
        hight: "200px",
        width: "500px", // Smaller box
        customClass: {
          title: "swal-title-small", // Styling title for compact size
        },
      });
      window.location.href("quests.html");
    } else {
      // Styled error alert
      Swal.fire({
        icon: "error",
        title: "⛔ Failed to Join",
        html: `
          <div style="font-size: 14px; color: #e53935;">
            ${data.message || "Something went wrong. Please try again."}
          </div>
        `,
        background: "#000000", // White background
        confirmButtonColor: "#e53935", // Red button
        width: "500px", // Smaller box
        hight: "200px", 
        customClass: {
          popup: 'custom-swal-box' // Applying custom class to the popup
      }
      });
    }
  } catch (error) {
    // Styled network error alert
    Swal.fire({
      icon: "warning",
      title: " Network Error",
      html: `
        <div style="font-size: 14px; color: #ff0000;">
          Unable to connect to the server. Check your connection and try again.
        </div>
      `,
      background: "#000000", // White background
      confirmButtonColor: "#28293E", // Nightlight blue button
      width: "350px", // Smaller box
    });
  }
}

// Attach the function to the button click event
document.getElementById("join-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const name = document.getElementById("name").value.trim();
  const teamPassword = document.getElementById("teamPassword").value.trim();

  if (!email || !name || !teamPassword) {
    Swal.fire({
      icon: "warning",
      title: "⚠️ Missing Information",
      html: `
        <div style="font-size: 14px; color: #e53935;">
          Please fill out all fields before proceeding.
        </div>
      `,
      background: "#ffffff", // White background
      confirmButtonColor: "#e53935", // Red button
      width: "350px", // Smaller box
    });
    return;
  }

  joinTeamFrontend(email, name, teamPassword);
});

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
      const challengeButton = document.querySelector(`.Challenge-btn:nth-child(${index + 1})`);
      
      if (challengeButton) {
        challengeButton.textContent = `def ${challenge.name}()`;  // Set challenge button text
        challengeButton.classList.remove("glow-red", "glow-green");  // Remove previous glow classes
        if (challenge.status === "corrected") {
          challengeButton.classList.add("glow-green");
          challengeButton.style.pointerEvents = "none";
        } else {
          challengeButton.classList.add("glow-red");
          challengeButton.style.pointerEvents = "auto";  
        }
        challengeButton.setAttribute("data-challenge-id", challenge._id);
        if (challenge.status !== "corrected") {
          challengeButton.setAttribute("onclick", `window.location.href='quest${challenge.name}.html?challengeId=${challenge._id}';`);
        }
      }
    });
  }
// Fetch and update challenges when the DOM loads
document.addEventListener("DOMContentLoaded", fetchChallenges);

// submit challenge function
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get("challengeId"); 
    if (challengeId) {
      document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const flag = document.querySelector("input[name='flag']");
        submitChallenge(challengeId, flag);
      });
    }
  });
   // submit challenge function
  async function submitChallenge(challengeId, flag) {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/${challengeId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong"}`);
        return;
      }
  
      const result = await response.json();
      if (result.message === "Challenge corrigé avec succès.") {
        alert("Challenge solved successfully!");
        window.location.href = "challenges.html";
      } else {
        alert(result.message || "Flag is incorrect.");
      }
    } catch (error) {
      console.error("Error submitting challenge:", error);
      alert("An error occurred while submitting the challenge.");
    }
  }