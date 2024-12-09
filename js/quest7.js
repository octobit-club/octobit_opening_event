const API_BASE_URL = "https://event-octobit.fun/api";

async function submitFlag(event) {
  event.preventDefault(); // Prevent default form submission

  const challengeId = "6755a06b845fa6f7d2d0f613"; // Hardcoded challenge ID
  const correctFlag = document.getElementById("password").value.trim(); // Get flag value
  const responseMessage = document.getElementById("error-message"); // Element to display error/success messages

  // Reset the visibility of the response message
  responseMessage.style.display = "none"; // Hide the message initially

  if (!correctFlag) {
    responseMessage.textContent = "Veuillez entrer un flag.";
    responseMessage.style.color = "red";
    responseMessage.style.display = "block"; // Show the error message
    return;
  }

  try {
    console.log("Submitting flag...");

    // Sending POST request with flag data
    const response = await fetch(`${API_BASE_URL}/${challengeId}/submit`, {
      method: "POST",
      credentials: "include", // Include cookies (if necessary)
      headers: {
        "Content-Type": "application/json", // Set content type
      },
      body: JSON.stringify({
        correctFlag,
      }), // Send the flag in JSON format
    });

    if (response.status === 401) {
      // If the user is not authenticated, redirect to the login page
      window.location.href = "/login.html";
      return;
    }

    // Check if the response was OK (status 200)
    if (response.ok) {
      const data = await response.json();
      console.log("Response data:", data); // Log the response data
      responseMessage.textContent =
        data.message || "Challenge corrigé avec succès !";
      responseMessage.style.color = "green";
      responseMessage.style.display = "block"; // Show the success message

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/quests.html";
      }, 2000);
    } else {
      // Handle error response (non-200 status)
      const data = await response.json();
      console.log("Error response data:", data); // Log error response data
      responseMessage.textContent = data.message || "Flag incorrect."; // Display the error message
      responseMessage.style.color = "red";
      responseMessage.style.display = "block"; // Show the error message
    }
  } catch (error) {
    console.error("Network error:", error);
    responseMessage.textContent = "Erreur réseau. Essayez de nouveau.";
    responseMessage.style.color = "red";
    responseMessage.style.display = "block"; // Show the error message
  }
}

// Ensure the form exists before adding the event listener
const form = document.getElementById("login-form");
if (!form) {
  console.error("Login form not found!");
} else {
  form.addEventListener("submit", submitFlag);
}
