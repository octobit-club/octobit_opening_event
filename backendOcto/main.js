

async function joinTeamFrontend(email, name, teamPassword) {
    const apiEndpoint = "https://event-octobit.fun/api/join"; // Your local API endpoint
  
    // Prepare the payload
    const payload = { email, name, teamPassword };
  
    try {
      // Make the API call
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        // Success: Display the token or perform further actions
        console.log("Login successful:", data.token);
        alert("You successfully joined the team!");
      } else {
        // Handle errors
        console.error("Error:", data);
        alert(data.message || "Failed to join the team.");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("An unexpected error occurred:", error);
      alert("An error occurred while connecting to the server. Please try again.");
    }
  }
  
  // Attach the function to the button click event
  document.getElementById("join-btn").addEventListener("click", () => {
    // Get input values
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const teamPassword = document.getElementById("teamPassword").value;
  
    // Call the joinTeamFrontend function
    joinTeamFrontend(email, name, teamPassword);
  });
  

