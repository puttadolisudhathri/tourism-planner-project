// ==================================================
// TOURISM PLANNER - AUTHENTICATION
// ==================================================


// ==================================================
// BACKEND API URL
// ==================================================

const API_URL = "http://localhost:5000/api/auth";


// ==================================================
// REGISTER
// ==================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get values from form
        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check passwords
        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;
        }


        // Check password length
        if (password.length < 6) {

            alert("Password must contain at least 6 characters.");

            return;
        }


        try {

            // Send registration data to backend
            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            // Check response
            if (!response.ok) {

                alert(data.message);

                return;
            }


            // Registration successful
            alert(
                "Registration successful! Please login."
            );


            // Go to Login page
            window.location.href = "/login.html";

        }

        catch (error) {

            console.error(error);

            alert(
                "Cannot connect to the backend server. Please make sure the backend is running."
            );
        }

    });

}


// ==================================================
// LOGIN
// ==================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Get login values
        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        try {

            // Send login data to backend
            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            // Check login response
            if (!response.ok) {

                alert(data.message);

                return;
            }


            // Save login information
            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "userName",
                data.user.name
            );

            localStorage.setItem(
                "userEmail",
                data.user.email
            );


            alert(
                "Login successful! Welcome to Tourism Planner."
            );


            // Open Tourism Planner
            window.location.href = "/";

        }

        catch (error) {

            console.error(error);

            alert(
                "Cannot connect to the backend server. Please make sure the backend is running."
            );
        }

    });

}