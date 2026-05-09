// assets/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // --- Login Logic (index.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        let selectedRole = 'aprendiz'; // Default
        const btnAprendiz = document.getElementById('role-aprendiz');
        const btnInstructor = document.getElementById('role-instructor');

        if (btnAprendiz && btnInstructor) {
            btnAprendiz.addEventListener('click', () => {
                selectedRole = 'aprendiz';
                btnAprendiz.className = 'flex-1 py-3 bg-mentora-blue-light text-white rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-mentora-blue-light transition-all';
                btnInstructor.className = 'flex-1 py-3 bg-white text-gray-500 rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-gray-200 hover:border-gray-300 transition-all';
            });
            btnInstructor.addEventListener('click', () => {
                selectedRole = 'instructor';
                btnInstructor.className = 'flex-1 py-3 bg-mentora-blue-light text-white rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-mentora-blue-light transition-all';
                btnAprendiz.className = 'flex-1 py-3 bg-white text-gray-500 rounded-xl font-bold flex flex-col items-center gap-2 border-2 border-gray-200 hover:border-gray-300 transition-all';
            });
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Save user role in localStorage to easily pass state between pages
            localStorage.setItem('mentora_role', selectedRole);

            // Redirect to appropriate home page
            if (selectedRole === 'aprendiz') {
                window.location.href = 'student_home.html';
            } else {
                window.location.href = 'instructor_home.html';
            }
        });
    }

    // --- Navigation Role Enforcement ---
    const currentRole = localStorage.getItem('mentora_role') || 'aprendiz';
    const isInstructor = currentRole === 'instructor';

    // Check if user is on wrong page (this is basic protection)
    const pathname = window.location.pathname;
    if (isInstructor && pathname.includes('student_')) {
        window.location.replace('instructor_home.html');
    } else if (!isInstructor && pathname.includes('instructor_')) {
        window.location.replace('student_home.html');
    }

    // Rewrite all links so generic pages like settings navigate back to the right place
    document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href) {
            if (isInstructor) {
                if (href === 'student_home.html') a.setAttribute('href', 'instructor_home.html');
                if (href === 'student_challenges.html') a.setAttribute('href', 'instructor_challenges.html');
                if (href === 'student_subjects.html') a.setAttribute('href', 'instructor_subjects.html');
                if (href === 'student_profile.html') a.setAttribute('href', 'instructor_profile.html');
            } else {
                if (href === 'instructor_home.html') a.setAttribute('href', 'student_home.html');
                if (href === 'instructor_challenges.html') a.setAttribute('href', 'student_challenges.html');
                if (href === 'instructor_subjects.html') a.setAttribute('href', 'student_subjects.html');
            }
        }
    });

    // --- Themes/Accessibility ---
    const applyThemes = () => {
        const isDark = localStorage.getItem('mentora_dark_mode') === 'true';
        const isHighContrast = localStorage.getItem('mentora_high_contrast') === 'true';
        const isColorBlind = localStorage.getItem('mentora_color_blind') === 'true';

        document.documentElement.classList.toggle('dark-mode', isDark);
        document.documentElement.classList.toggle('high-contrast', isHighContrast);
        document.documentElement.classList.toggle('color-blind', isColorBlind);
    };

    // Apply themes on every page load
    applyThemes();

    // Hook up checkboxes if they exist (settings / accessibility views)
    const setupToggle = (id, storageKey) => {
        const el = document.getElementById(id);
        if (el) {
            el.checked = localStorage.getItem(storageKey) === 'true';
            el.addEventListener('change', (e) => {
                localStorage.setItem(storageKey, e.target.checked);
                applyThemes();
            });
        }
    };

    setupToggle('toggle-dark-mode', 'mentora_dark_mode');
    setupToggle('toggle-high-contrast', 'mentora_high_contrast');
    setupToggle('toggle-color-blind', 'mentora_color_blind');

    // --- Layout / Navigation Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuBackdrop = document.getElementById('menu-backdrop');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.remove('hidden');
            menuOverlay.classList.add('flex');
        });
    }

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.add('hidden');
            menuOverlay.classList.remove('flex');
        }
    };

    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('mentora_role');
            window.location.href = 'index.html';
        });
    }
});
