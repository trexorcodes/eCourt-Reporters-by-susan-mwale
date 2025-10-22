// Simple login functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded - JavaScript is working!');
    
    const loginForm = document.querySelector('.login-form');
    console.log('Login form found:', loginForm);
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Username:', username);
        console.log('Password:', password);
        
        // Simple validation - in real app, this would connect to a backend
        if (username && password) {
            console.log('Validation passed - redirecting to dashboard');
            // Redirect to dashboard
            window.location.href = 'pages/dashboard.html';
        } else {
            console.log('Validation failed - showing alert');
            alert('Please enter both username and password');
        }
    });
});