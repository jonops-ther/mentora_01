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

    // --- Desktop Right Sidebar ---
    const DESKTOP_BP = 1024;
    const isLoginPage = !!document.getElementById('login-form');
    const hasSidebar = !!document.getElementById('menu-overlay');

    if (hasSidebar) {
        document.body.classList.add('has-sidebar');
    }

    function createDesktopSidebar() {
        if (isLoginPage || !hasSidebar) return;
        if (document.getElementById('desktop-sidebar-right')) return;

        const role = localStorage.getItem('mentora_role') || 'aprendiz';
        const sidebar = document.createElement('aside');
        sidebar.id = 'desktop-sidebar-right';

        if (role === 'instructor') {
            sidebar.innerHTML = `
                <div style="margin-bottom:1.5rem;">
                    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
                        <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid #e5e7eb;flex-shrink:0;">
                            <img src="https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=80&h=80&fit=crop" onerror="this.onerror=null;this.src='assets/images/img_perfil.svg';" alt="Foto" style="width:100%;height:100%;object-fit:cover;">
                        </div>
                        <div>
                            <div style="font-weight:700;color:#143771;font-size:0.95rem;">Carlos Mendoza</div>
                            <div style="font-size:0.75rem;color:#6b7280;">Instructor</div>
                        </div>
                    </div>
                </div>

                <div class="sidebar-card">
                    <h4>📊 Resumen General</h4>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Aprendices</span>
                        <span class="sidebar-stat-value" style="color:#1F6DA9;">124</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Actividades</span>
                        <span class="sidebar-stat-value" style="color:#AADD37;">18</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Recompensas</span>
                        <span class="sidebar-stat-value" style="color:#F9B032;">342</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Avance general</span>
                        <span class="sidebar-stat-value" style="color:#143771;">68%</span>
                    </div>
                </div>

                <div class="sidebar-card">
                    <h4>⚡ Acciones Rápidas</h4>
                    <a href="instructor_activity_create.html" class="sidebar-link">
                        <div class="sidebar-link-icon" style="background:#eef2ff;color:#6366f1;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        </div>
                        Generar actividad
                    </a>
                    <a href="instructor_rewards.html" class="sidebar-link">
                        <div class="sidebar-link-icon" style="background:#fff7ed;color:#F9B032;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                        </div>
                        Asignar recompensa
                    </a>
                    <a href="instructor_create_post.html" class="sidebar-link">
                        <div class="sidebar-link-icon" style="background:#ecfdf5;color:#059669;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </div>
                        Crear post
                    </a>
                </div>

                <div class="sidebar-card">
                    <h4>📋 Fichas Activas</h4>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Ficha 3114544</span>
                        <span class="sidebar-stat-value" style="font-size:0.8rem;color:#1F6DA9;">20 apr.</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Ficha 4920192</span>
                        <span class="sidebar-stat-value" style="font-size:0.8rem;color:#143771;">20 apr.</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Ficha 5928192</span>
                        <span class="sidebar-stat-value" style="font-size:0.8rem;color:#6366f1;">20 apr.</span>
                    </div>
                </div>
            `;
        } else {
            sidebar.innerHTML = `
                <div style="margin-bottom:1.5rem;">
                    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
                        <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid #e5e7eb;flex-shrink:0;">
                            <img src="assets/images/img_perfil.svg" onerror="this.onerror=null;" alt="Foto" style="width:100%;height:100%;object-fit:cover;">
                        </div>
                        <div>
                            <div style="font-weight:700;color:#143771;font-size:0.95rem;">Felipe Restrepo</div>
                            <div style="font-size:0.75rem;color:#6b7280;">Producción multimedia</div>
                        </div>
                    </div>
                </div>

                <div class="sidebar-card">
                    <h4>🔥 Racha y Puntos</h4>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Racha diaria</span>
                        <span class="sidebar-stat-value" style="color:#F9B032;">🔥 7 días</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Puntos totales</span>
                        <span class="sidebar-stat-value" style="color:#1F6DA9;">⭐ 1250</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Ranking</span>
                        <span class="sidebar-stat-value" style="color:#AADD37;">🏆 #5</span>
                    </div>
                </div>

                <div class="sidebar-card">
                    <h4>🎯 Desafío Diario</h4>
                    <div style="background:linear-gradient(135deg,#F9B032,#f59e0b);border-radius:0.75rem;padding:1rem;color:white;margin-bottom:0.5rem;">
                        <div style="font-weight:700;font-size:0.9rem;margin-bottom:0.25rem;">Conectores correctos</div>
                        <div style="font-size:0.75rem;opacity:0.9;">5 oraciones · 5:00 min</div>
                        <div style="margin-top:0.5rem;display:flex;align-items:center;gap:0.5rem;">
                            <span style="background:rgba(0,0,0,0.2);padding:0.25rem 0.75rem;border-radius:2rem;font-size:0.7rem;font-weight:600;">+50 pts</span>
                            <span style="background:rgba(0,0,0,0.2);padding:0.25rem 0.75rem;border-radius:2rem;font-size:0.7rem;font-weight:600;">x1.5</span>
                        </div>
                    </div>
                    <a href="desafio.html" class="sidebar-link" style="justify-content:center;background:#eff6ff;color:#1F6DA9;font-weight:700;margin-top:0.5rem;">
                        ¡Jugar ahora!
                    </a>
                </div>

                <div class="sidebar-card">
                    <h4>📚 Mi Progreso</h4>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Comunicación</span>
                        <span class="sidebar-stat-value" style="font-size:0.85rem;color:#1F6DA9;">45%</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">SST</span>
                        <span class="sidebar-stat-value" style="font-size:0.85rem;color:#F9B032;">20%</span>
                    </div>
                    <div class="sidebar-stat">
                        <span class="sidebar-stat-label">Ética</span>
                        <span class="sidebar-stat-value" style="font-size:0.85rem;color:#AADD37;">80%</span>
                    </div>
                </div>

                <div class="sidebar-card" style="text-align:center;background:#f0f9ff;border-color:#bfdbfe;">
                    <div style="font-size:1.5rem;margin-bottom:0.25rem;">💡</div>
                    <div style="font-size:0.8rem;color:#374151;font-weight:500;line-height:1.4;">La práctica constante mejora la retención en un <strong style="color:#1F6DA9;">80%</strong>. ¡Sigue adelante!</div>
                </div>
            `;
        }

        document.body.appendChild(sidebar);
    }

    function removeDesktopSidebar() {
        const existing = document.getElementById('desktop-sidebar-right');
        if (existing) existing.remove();
    }

    function handleDesktopLayout() {
        if (window.innerWidth >= DESKTOP_BP) {
            createDesktopSidebar();
        } else {
            removeDesktopSidebar();
        }
    }

    handleDesktopLayout();
    window.addEventListener('resize', handleDesktopLayout);

    // Prevent menu toggle on desktop (sidebar is always visible via CSS)
    if (menuBtn && menuOverlay && window.innerWidth >= DESKTOP_BP) {
        menuBtn.removeEventListener('click', () => {});
    }
});
