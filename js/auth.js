// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    } else if (user && window.location.href.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    if (user) {
        const userData = JSON.parse(user);
        document.getElementById('userName').textContent = `Welcome, ${userData.name}`;
    }
}

// Show login modal
function showLoginForm() {
    document.getElementById('loginModal').style.display = 'block';
}

// Show signup modal
function showSignupForm() {
    document.getElementById('signupModal').style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle login
function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password');
    }
}

// Handle signup
function signup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }

    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log user in
    localStorage.setItem('user', JSON.stringify(newUser));
    window.location.href = 'dashboard.html';
}

// Handle logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth);
