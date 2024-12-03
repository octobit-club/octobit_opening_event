const correctPassword = "123"; // The password to unlock the content

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const enteredPassword = document.getElementById("password").value;

    if (enteredPassword === correctPassword) {
        // Redirect to the protected page on successful password match
        window.location.href = "123456.html";
    } else {
        // Show error message on incorrect password
        document.getElementById("error-message").style.display = "block";
    }
});