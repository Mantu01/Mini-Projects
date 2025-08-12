// Main Application JavaScript
class TrustPredictApp {
    constructor() {
        this.currentPage = 'home';
        this.pages = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Load pages, then apply initial route based on path
        this.loadPages().then(() => this.applyInitialRoute());
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.loadUserData();
    }

    setupEventListeners() {
        // Navigation event delegation (support clicks on children inside links)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link) {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    this.navigateTo(page);
                }
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.showPage(e.state.page);
            } else {
                // Fallback to current pathname when state is missing (e.g., direct load)
                this.applyInitialRoute();
            }
        });
    }

    async loadPages() {
        // Load all page content
        this.pages = {
            signup: await this.loadPageContent('signup'),
            login: await this.loadPageContent('login'),
            about: await this.loadPageContent('about'),
            contact: await this.loadPageContent('contact'),
            profile: await this.loadPageContent('profile'),
            dashboard: await this.loadPageContent('dashboard')
        };
    }

    async loadPageContent(pageName) {
        const response = await fetch(`pages/${pageName}.html`);
        if (response.ok) {
            return await response.text();
        }
        return `<div class="text-center py-20"><h2 class="text-2xl text-gray-600">Page not found</h2></div>`;
    }

    async navigateTo(page) {
        if (page === this.currentPage) return;

        // Check if user is logged in for protected pages
        if (['profile', 'dashboard'].includes(page) && !this.isUserLoggedIn()) {
            this.navigateTo('login');
            return;
        }

        this.currentPage = page;
        this.showPage(page);
        this.updateNavigation();
        this.updateURL(page);
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        if (page === 'home') {
            document.getElementById('home-page').classList.add('active');
            document.getElementById('page-content').innerHTML = '';
        } else {
            document.getElementById('home-page').classList.remove('active');
            if (this.pages[page]) {
                document.getElementById('page-content').innerHTML = this.pages[page];
                this.initializePageSpecificFeatures(page);
            } else {
                document.getElementById('page-content').innerHTML = `<div class="text-center py-20"><h2 class="text-2xl text-gray-600">Page not found</h2></div>`;
            }
        }

        this.currentPage = page;
        this.updateNavigation();
    }

    updateNavigation() {
        // Update active navigation states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-white', 'bg-blue-600');
            if (link.dataset.page === this.currentPage) {
                link.classList.add('text-white', 'bg-blue-600');
            }
        });
    }

    updateURL(page, { replace = false } = {}) {
        const url = page === 'home' ? '/' : `/${page}`;
        const state = { page };
        if (replace) {
            window.history.replaceState(state, '', url);
        } else {
            window.history.pushState(state, '', url);
        }
    }

    applyInitialRoute() {
        const page = this.getPageFromPath(window.location.pathname);
        const protectedPage = ['profile', 'dashboard'].includes(page);
        const finalPage = protectedPage && !this.isUserLoggedIn() ? 'login' : page;
        this.showPage(finalPage);
        this.updateURL(finalPage, { replace: true });
    }

    getPageFromPath(pathname) {
        // Normalize pathname and map to page keys
        // Handles '/', '/login', '/folder/index.html', etc.
        let segment = pathname;
        try {
            // If hosted in a subdirectory, get the last segment
            const parts = pathname.split('/').filter(Boolean);
            segment = parts.length === 0 ? '' : parts[parts.length - 1];
        } catch (_) {
            segment = '';
        }
        if (segment === '' || segment === 'index.html') return 'home';
        const known = ['home', 'login', 'signup', 'about', 'contact', 'profile', 'dashboard'];
        return known.includes(segment) ? segment : 'home';
    }

    initializePageSpecificFeatures(page) {
        switch (page) {
            case 'signup':
                this.initializeSignupForm();
                break;
            case 'login':
                this.initializeLoginForm();
                break;
            case 'profile':
                this.initializeProfilePage();
                break;
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'contact':
                this.initializeContactForm();
                break;
        }
    }

    initializeSignupForm() {
        const form = document.getElementById('signup-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSignup(e));
            this.setupFormValidation(form);
        }
    }

    initializeLoginForm() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    initializeProfilePage() {
        this.loadUserProfile();
        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }
    }

    initializeDashboard() {
        const form = document.getElementById('health-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleHealthSubmission(e));
            this.setupBMICalculation();
        }
        this.loadHealthHistory();
    }

    initializeContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleContactSubmission(e));
            this.setupFormValidation(form);
        }
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        } else if (field.name === 'age' && value && (value < 1 || value > 120)) {
            isValid = false;
            errorMessage = 'Please enter a valid age';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        errorDiv.id = `${field.id}-error`;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500');
        const errorDiv = field.parentNode.querySelector(`#${field.id}-error`);
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Save user data
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData);
            this.saveUserData(userData);

            // Show success message
            this.showNotification('Account created successfully!', 'success');
            
            // Redirect to login
            setTimeout(() => this.navigateTo('login'), 1500);

        } catch (error) {
            this.showNotification('Error creating account. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if user exists (simple check for demo)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);

            if (user) {
                // Save login state
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.showNotification('Login successful!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => this.navigateTo('dashboard'), 1500);
            } else {
                this.showNotification('Invalid credentials. Please try again.', 'error');
            }

        } catch (error) {
            console.log(error);
            this.showNotification('Login failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validate form
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user data
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData);
            this.updateUserData(userData);

            this.showNotification('Profile updated successfully!', 'success');

        } catch (error) {
            this.showNotification('Error updating profile. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleHealthSubmission(e) {
        e.preventDefault();
        const form = e.target;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Analyzing...';
        submitBtn.disabled = true;

        // Show AI response area
        const aiResponse = document.getElementById('ai-response');
        if (aiResponse) {
            aiResponse.classList.remove('hidden');
            aiResponse.innerHTML = `
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span class="ml-3 text-lg text-gray-600">AI is analyzing your health data...</span>
                </div>
            `;
        }

        try {
            // Get form data
            const formData = new FormData(form);
            const healthData = Object.fromEntries(formData);

            // Use the AI module to generate response
            const healthAI = new HealthAI();
            const response = await healthAI.generateAIResponse(healthData);
            
            if (aiResponse) {
                aiResponse.innerHTML = response;
            }

            // Save health data
            this.saveHealthData(healthData);

            this.showNotification('Health analysis completed!', 'success');

        } catch (error) {
            console.error('AI Analysis Error:', error);
            if (aiResponse) {
                aiResponse.innerHTML = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        Error analyzing health data. Please try again.
                    </div>
                `;
            }
            this.showNotification('Analysis failed. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleContactSubmission(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validate form
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();

        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }



    saveUserData(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
    }

    updateUserData(userData) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    saveHealthData(healthData) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const healthHistory = JSON.parse(localStorage.getItem('healthHistory') || '{}');
        
        if (!healthHistory[currentUser.email]) {
            healthHistory[currentUser.email] = [];
        }
        
        healthHistory[currentUser.email].push({
            ...healthData,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('healthHistory', JSON.stringify(healthHistory));
    }

    loadUserData() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.updateNavigationForLoggedInUser();
        }
    }

    loadUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.email) {
            // Populate profile form
            Object.keys(currentUser).forEach(key => {
                const field = document.getElementById(key);
                if (field) {
                    field.value = currentUser[key];
                }
            });
        }
    }

    loadHealthHistory() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const healthHistory = JSON.parse(localStorage.getItem('healthHistory') || '{}');
        const userHistory = healthHistory[currentUser.email] || [];
        
        const historyContainer = document.getElementById('health-history');
        if (historyContainer && userHistory.length > 0) {
            const recentEntries = userHistory.slice(-5).reverse();
            historyContainer.innerHTML = recentEntries.map(entry => `
                <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-medium text-gray-900">Health Assessment</p>
                            <p class="text-sm text-gray-600">${new Date(entry.timestamp).toLocaleDateString()}</p>
                        </div>
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Completed</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateNavigationForLoggedInUser() {
        // Update navigation to show user-specific options
        const navLinks = document.querySelectorAll('.nav-link[data-page="login"], .nav-link[data-page="signup"]');
        navLinks.forEach(link => {
            if (link.dataset.page === 'login') {
                link.textContent = 'Dashboard';
                link.dataset.page = 'dashboard';
            } else if (link.dataset.page === 'signup') {
                link.textContent = 'Profile';
                link.dataset.page = 'profile';
            }
        });
    }

    isUserLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-up`;
        
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        notification.className += ` ${bgColor} text-white`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${this.getNotificationIcon(type)}</span>
                <p>${message}</p>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            case 'error':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            default:
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        this.updateThemeIcons(savedTheme === 'dark');

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.updateThemeIcons(isDark);
        });
    }

    updateThemeIcons(isDark) {
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        
        if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    setupBMICalculation() {
        const weightInput = document.getElementById('weight');
        const heightInput = document.getElementById('height');
        const bmiInput = document.getElementById('bmi');

        if (weightInput && heightInput && bmiInput) {
            const calculateBMI = () => {
                const weight = parseFloat(weightInput.value);
                const height = parseFloat(heightInput.value);

                if (weight && height && height > 0) {
                    const heightInMeters = height / 100;
                    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
                    bmiInput.value = bmi;
                } else {
                    bmiInput.value = '';
                }
            };

            weightInput.addEventListener('input', calculateBMI);
            heightInput.addEventListener('input', calculateBMI);
        }
    }

    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('#mobile-menu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrustPredictApp();
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.hash && e.target.hash.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.hash);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
