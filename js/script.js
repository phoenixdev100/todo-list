// Mobile menu state
let isMobileMenuOpen = false;

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileMenuBtn) {
        isMobileMenuOpen = !isMobileMenuOpen;
        navMenu.classList.toggle('active');
        
        // Update menu button icon
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.className = isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && mobileMenuBtn && isMobileMenuOpen) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Ensure menu is closed on page load
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
        isMobileMenuOpen = false;
    }
});
