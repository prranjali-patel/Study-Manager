document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Handle login form submission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        fetch('/login', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Redirect to dashboard or another page
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Handle signup form submission
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        fetch('/signup', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                // Redirect to dashboard or login page
            }
        })
        .catch(error => console.error('Error:', error));
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginLink = document.getElementById("login-link");

    // Toggle between login and signup forms
    loginTab.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        loginTab.classList.add("bg-purple-500");
        signupTab.classList.remove("bg-green-500");
    });

    signupTab.addEventListener("click", () => {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        signupTab.classList.add("bg-green-500");
        loginTab.classList.remove("bg-purple-500");
    });

    // Switch to login from signup page
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        loginTab.classList.add("bg-purple-500");
        signupTab.classList.remove("bg-green-500");
    });

    // Add form validation here if needed
});
