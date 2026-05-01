/**
 * Aevura OS - Unified UI Controller
 * Injects shared Header, Footer, and Auth logic.
 * Handles Theme Management (Dark/Light).
 */

async function initOS() {
    // Initialize Theme
    document.documentElement.setAttribute('data-theme', 'dark');

    // 0. Render Skeleton Header Immediately (to avoid flicker)
    renderHeader(null);

    // 1. Auth Guard
    try {
        const response = await fetch('/api/me');
        const data = await response.json();
        if (data.error || !data.profile) {
            window.location.href = 'signin.html';
            return;
        }
        window.currentUser = data.profile;
        
        // 2. Mission Data Pre-fetch (Deferred for mobile performance)
        if (!sessionStorage.getItem('aevura_mission_cache')) {
            setTimeout(() => {
                fetch('/api/progress')
                    .then(r => r.json())
                    .then(pData => {
                        if (!pData.error) {
                            sessionStorage.setItem('aevura_mission_cache', JSON.stringify(pData));
                        }
                    })
                    .catch(() => {});
            }, 2000); // Wait 2 seconds for main page to settle
        }

        // Update detected if this is a module page
        const modulePages = ['index.html', 'freelancer-assistant.html', 'simulation.html', 'case-study-architect.html', 'skill-gap-analyzer.html', 'contract-generator.html', 'decision-engine.html', 'modules.html', 'progress.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'landing.html';
        if (modulePages.includes(currentPage)) {
            document.body.classList.add('is-module');
        }

        renderHeader(data.profile);
    } catch (err) {
        console.error("Auth Failure", err);
        window.location.href = 'signin.html';
    }

    // 2. Initialize Command Palette
    if (typeof initPalette === 'function') {
        if (!document.querySelector('link[href*="command-palette.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/command-palette.css';
            document.head.appendChild(link);
        }
        initPalette();
    }
}

function renderHeader(user) {
    const existingHeader = document.querySelector('header.os-header');
    
    // If user is null, we are in "pre-auth" state
    const userName = user ? user.name : 'AUTHENTICATING...';
    
    if (existingHeader) {
        // Just update the user-specific parts to avoid re-rendering the whole DOM
        const nameEl = existingHeader.querySelector('.user-name');
        if (nameEl) nameEl.textContent = userName;
        
        let mobileNav = document.getElementById('mobileNav');
        if (!mobileNav) {
            mobileNav = document.createElement('div');
            mobileNav.className = 'mobile-nav';
            mobileNav.id = 'mobileNav';
            mobileNav.innerHTML = `
                <a href="landing.html" onclick="toggleMobileMenu()">Dashboard</a>
                <a href="modules.html" onclick="toggleMobileMenu()">Modules Index</a>
                <a href="about-me.html" onclick="toggleMobileMenu()">About Me</a>
                <a href="contact-us.html" onclick="toggleMobileMenu()">Contact Us</a>
                <a href="#" onclick="togglePalette(); toggleMobileMenu(); return false;" style="color: var(--os-accent);">Search Commands</a>
                <div style="padding: 20px; border-top: 1px solid var(--os-border); margin-top: auto;">
                    <div style="font-size: 10px; color: var(--os-text-dim); margin-bottom: 10px;">USER: ${userName}</div>
                    <button onclick="osSignout()" style="width: 100%; padding: 10px; background: var(--os-accent); color: #000; border: none; font-weight: 700; font-family: inherit; font-size: 11px;">TERMINATE SESSION</button>
                </div>
            `;
            existingHeader.insertAdjacentElement('afterend', mobileNav);
        } else {
            const mobileNameEl = mobileNav.querySelector('div div');
            if (mobileNameEl) mobileNameEl.textContent = `USER: ${userName}`;
        }
        return;
    }

    const header = document.createElement('header');
    header.className = 'os-header';
    header.innerHTML = `
        <div class="header-inner">
            <div class="header-left">
                <a href="landing.html" class="os-logo">
                    <span class="logo-mark">>_</span>
                    <span class="logo-text">AEVURA <span class="logo-os">OS</span></span>
                </a>
                <span class="sep hide-mobile"></span>
                <span class="version hide-mobile">v1.0.5</span>
            </div>
            
            <nav class="header-nav hide-mobile">
                <a href="landing.html">Dashboard</a>
<a href="modules.html">Modules</a>
                <a href="about-me.html">About Me</a>
                <a href="contact-us.html">Contact Us</a>
            </nav>

            <div class="header-right">
                <div class="status-indicator hide-mobile">
                    <span class="dot"></span>
                    SYSTEM NOMINAL
                </div>
                <div class="user-info">
                    <span class="user-name hide-mobile">${userName}</span>
                    <button onclick="osSignout()" class="btn-signout">TERMINATE</button>
                </div>
                <button class="header-cmd-btn show-mobile" onclick="togglePalette()" title="System Commands">
                    <span>>_</span>
                </button>
                <button class="menu-toggle show-mobile" onclick="toggleMobileMenu()">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
        <div class="mobile-nav" id="mobileNav">
            <a href="landing.html" onclick="toggleMobileMenu()">Dashboard</a>
            <a href="modules.html" onclick="toggleMobileMenu()">Modules Index</a>
            <a href="about-me.html" onclick="toggleMobileMenu()">About Me</a>
            <a href="contact-us.html" onclick="toggleMobileMenu()">Contact Us</a>
            <a href="#" onclick="togglePalette(); toggleMobileMenu(); return false;" style="color: var(--os-accent);">Search Commands</a>
            <div style="padding: 20px; border-top: 1px solid var(--os-border); margin-top: auto;">
                <div style="font-size: 10px; color: var(--os-text-dim); margin-bottom: 10px;">USER: ${userName}</div>
                <button onclick="osSignout()" style="width: 100%; padding: 10px; background: var(--os-accent); color: #000; border: none; font-weight: 700; font-family: inherit; font-size: 11px;">TERMINATE SESSION</button>
            </div>
        </div>
    `;
    document.body.prepend(header);

    const currentPath = window.location.pathname.split('/').pop() || 'landing.html';
    document.querySelectorAll('.header-nav a, .mobile-nav a').forEach(a => {
        if (a.getAttribute('href') === currentPath) a.classList.add('active');
    });
}

window.toggleMobileMenu = function() {
    const nav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.menu-toggle');
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
};

async function osSignout() {
    await fetch('/api/signout', { method: 'POST' });
    window.location.href = 'signin.html';
}

// Global Theme Styles
const style = document.createElement('style');
style.textContent = `
    :root {
        --os-accent: #FF3E00;
        --os-header-h: 60px;
    }

    [data-theme="dark"] {
        --os-bg: #0a0a0a;
        --os-surface: #141414;
        --os-text: #e0e0e0;
        --os-text-dim: #666;
        --os-border: #222;
        --os-header-bg: #000;
    }

    body {
        background-color: var(--os-bg);
        color: var(--os-text);
        transition: background-color 0.3s, color 0.3s;
        margin: 0;
        -webkit-font-smoothing: antialiased;
        position: relative;
        overflow-x: hidden;
    }

    /* Universal Industrial Scrollbar */
    * {
        scrollbar-width: thin;
        scrollbar-color: #FF3E00 var(--os-bg);
    }

    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background: var(--os-bg);
    }

    ::-webkit-scrollbar-thumb {
        background: #FF3E00;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #e63700;
    }

    /* Global Scanline Overlay - Optimized for Mobile */
    body::before {
        content: " ";
        display: block;
        position: fixed;
        top: 0; left: 0; bottom: 0; right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%);
        z-index: 9998;
        background-size: 100% 4px;
        pointer-events: none;
        opacity: 0.1;
    }
    
    /* Disable heavy animations on mobile if needed, but for now we simplify the pattern */
    @media (max-width: 768px) {
        body::before {
            background-size: 100% 8px; /* Larger gap = fewer pixels to paint */
        }
    }

    .os-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--os-header-bg);
        border-bottom: 1px solid var(--os-border);
        color: var(--os-text);
        height: var(--os-header-h);
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
    }

    .logo-os {
        color: var(--os-accent);
        font-size: 0.85em;
        margin-left: 2px;
        vertical-align: baseline;
    }

    /* Slim Header for Modules */
    body.is-module .os-header {
        height: 45px;
    }
    body.is-module .os-header .header-nav a {
        font-size: 10px;
    }

    /* Global Breadcrumb Styling (Slim Navbar) */
    .breadcrumb {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 11px;
        color: var(--os-text-dim);
        text-transform: uppercase;
        margin-bottom: 2rem;
        letter-spacing: 1px;
        font-family: 'JetBrains Mono', monospace;
    }
    .breadcrumb span { color: var(--os-text); }
    .breadcrumb a { color: var(--os-text-dim); text-decoration: none; transition: color 0.2s; }
    .breadcrumb a:hover { color: var(--os-accent); }

    .btn-back {
        margin-left: auto;
        background: transparent;
        border: 1px solid var(--os-border);
        color: var(--os-text-dim);
        padding: 6px 14px;
        font-family: inherit;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.15s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .btn-back:hover {
        border-color: var(--os-accent);
        color: var(--os-accent);
    }

    .header-inner {
        max-width: 1400px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
    }

    .header-left, .header-right { display: flex; align-items: center; gap: 15px; }

    .os-logo {
        color: var(--os-accent);
        text-decoration: none;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        letter-spacing: 1px;
    }

    .logo-mark {
        border: 1px solid var(--os-accent);
        padding: 2px 4px;
        font-size: 10px;
    }

    .sep { width: 1px; height: 16px; background: var(--os-border); }
    .version { color: var(--os-text-dim); font-size: 9px; }

    .header-nav { display: flex; gap: 5px; height: 100%; }
    .header-nav a {
        color: var(--os-text-dim);
        text-decoration: none;
        padding: 0 15px;
        display: flex;
        align-items: center;
        transition: all 0.1s;
        border-bottom: 2px solid transparent;
    }
    .header-nav a:hover { color: var(--os-text); background: rgba(255,255,255,0.05); }
    .header-nav a.active { color: var(--os-accent); border-bottom-color: var(--os-accent); }

    .status-indicator { display: flex; align-items: center; gap: 6px; color: var(--os-text-dim); font-size: 9px; }
    .status-indicator .dot { width: 5px; height: 5px; background: #00ff66; border-radius: 50%; box-shadow: 0 0 8px #00ff66; animation: os-pulse 2s infinite; }

    @keyframes os-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    .user-info { display: flex; align-items: center; gap: 10px; }
    .btn-signout {
        background: none;
        border: 1px solid var(--os-border);
        color: var(--os-text-dim);
        padding: 6px 12px;
        cursor: pointer;
        font-family: inherit;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .btn-signout:hover { border-color: var(--os-accent); color: var(--os-accent); }

    .header-cmd-btn {
        background: none;
        border: 1px solid var(--os-border);
        color: var(--os-accent);
        padding: 5px 10px;
        font-family: inherit;
        font-weight: 700;
        cursor: pointer;
        display: none;
    }

    .footer a {
        transition: color 0.2s, opacity 0.2s;
    }
    .footer a:hover {
        color: var(--os-accent) !important;
        opacity: 1 !important;
    }
    .btn-back-top:hover {
        color: var(--os-accent) !important;
        border-color: var(--os-accent) !important;
    }

    /* Mobile Nav */
    .menu-toggle {
        display: none;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }
    .menu-toggle span {
        display: block;
        width: 18px;
        height: 2px;
        background: var(--os-text);
        transition: 0.3s;
    }
    .menu-toggle.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .menu-toggle.active span:nth-child(2) { opacity: 0; }
    .menu-toggle.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

    .mobile-nav {
        position: fixed;
        top: var(--os-header-h);
        left: 0;
        width: 100%;
        height: calc(100vh - var(--os-header-h));
        background: #000;
        z-index: 999;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mobile-nav.active { transform: translateX(0); }
    .mobile-nav a {
        padding: 25px;
        font-size: 18px;
        color: var(--os-text);
        text-decoration: none;
        border-bottom: 1px solid var(--os-border);
        text-transform: uppercase;
        font-weight: 700;
        font-family: 'Space Grotesk', sans-serif;
    }
    .mobile-nav a.active { color: var(--os-accent); }

    /* Global Responsive Utilities */
    .hide-mobile { display: flex !important; }
    .show-mobile { display: none !important; }

    @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .show-mobile { display: flex !important; }
        
        .header-cmd-btn { display: flex !important; }

        /* Command Palette Mobile Overrides */
        .palette-container { 
            width: 95% !important; 
            margin-top: 20px !important; 
        }
        .palette-footer { display: none !important; }

        .os-header { height: 60px; }
        .logo-text { font-size: 10px; }
        
        /* Universal Layout Fixes */
        .app-container, .container { padding: 1.2rem !important; }
        .analyzer-grid, .engine-grid, .profile-grid, .grid, .grid-12 { 
            grid-template-columns: 1fr !important; 
            gap: 1.5rem !important; 
        }
        
        .sidebar { 
            position: relative !important; 
            top: 0 !important; 
            flex-direction: row !important; 
            overflow-x: auto; 
            padding-bottom: 10px;
            white-space: nowrap;
        }
        .tab-btn { flex-shrink: 0; padding: 0.8rem 1.2rem !important; }

        .header-section h1 { font-size: 2.2rem !important; letter-spacing: -1px !important; }
        .panel, .result-panel, .content-card { padding: 1.5rem !important; }
        .gap-grid { grid-template-columns: 1fr !important; }
        
        /* Hero Section */
        .hero { 
            padding: 100px 20px 60px 20px !important; 
            text-align: center; 
            min-height: auto !important; 
            justify-content: center !important; 
        }
        .hero__title { font-size: 2.8rem !important; line-height: 1 !important; }
        .hero__bottom { flex-direction: column !important; align-items: center !important; text-align: center; }
        .hero__stats, .hero__kpis { justify-content: center; width: 100%; }

        /* Section Header Fixes */
        .section__header, .stack__header, .header-section {
            order: -1 !important;
            margin-bottom: 2rem !important;
        }
        
        /* Bento & Stack Cards */
        .bento__grid { grid-template-columns: 1fr !important; }
        .bento-card--wide, .bento-card--mid, .bento-card--narrow { grid-column: span 1 !important; }
        .stack__card { grid-template-columns: 1fr !important; padding: 1.5rem !important; }
        .stack__card-left { display: none; } /* Hide the big numbers on mobile to save space */
        .stack__card-right { grid-column: span 1 !important; }

        /* Footer */
        .footer__top { grid-template-columns: 1fr !important; gap: 2rem !important; }
        .footer__brand, .footer__col { grid-column: span 1 !important; }
        .footer__bottom { flex-direction: column; text-align: center; }

        /* Module Specifics */
        .rec-value { font-size: 1.5rem !important; }
        .score-container { flex-direction: column; text-align: center; }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', initOS);

// === TOAST NOTIFICATION SYSTEM ===
window.showToast = function(message, type = 'info') {
    let container = document.getElementById('os-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'os-toast-container';
        document.body.appendChild(container);
        
        // Inject styles if not present
        if (!document.getElementById('os-toast-style')) {
            const style = document.createElement('style');
            style.id = 'os-toast-style';
            style.textContent = `
                #os-toast-container {
                    position: fixed; bottom: 30px; right: 30px;
                    z-index: 9999; display: flex; flex-direction: column; gap: 10px;
                    pointer-events: none;
                }
                .os-toast {
                    background: #1e1e1e; border: 1px solid #35393b; border-left: 4px solid #FF3E00;
                    color: #e8e6e3; padding: 14px 20px; font-family: 'JetBrains Mono', monospace; font-size: 12px;
                    box-shadow: 8px 8px 0px rgba(0,0,0,0.5);
                    transform: translateX(120%); transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    pointer-events: auto; display: flex; align-items: center; justify-content: space-between;
                    min-width: 280px; max-width: 400px; line-height: 1.4;
                }
                .os-toast.show { transform: translateX(0); }
                .os-toast.error { border-left-color: #ff3333; }
                .os-toast.success { border-left-color: #00ff66; }
                .os-toast-close {
                    background: none; border: none; color: #b1aba1; cursor: pointer;
                    font-size: 16px; margin-left: 15px; padding: 0; line-height: 1;
                }
                .os-toast-close:hover { color: #fff; }
            `;
            document.head.appendChild(style);
        }
    }
    
    const toast = document.createElement('div');
    toast.className = 'os-toast ' + type;
    
    // Auto-detect error/success
    const msgLower = (message || '').toString().toLowerCase();
    if (msgLower.includes('error') && type === 'info') toast.className = 'os-toast error';
    if ((msgLower.includes('success') || msgLower.includes('copied')) && type === 'info') toast.className = 'os-toast success';
    
    toast.innerHTML = '<span>' + message + '</span><button class="os-toast-close">&times;</button>';
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    const closeToast = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    };
    
    toast.querySelector('.os-toast-close').addEventListener('click', closeToast);
    setTimeout(closeToast, 4000);
};

// Override default window.alert
window.alert = function(message) {
    let type = 'info';
    const msgLower = (message || '').toString().toLowerCase();
    if (msgLower.includes('error')) type = 'error';
    if (msgLower.includes('copied') || msgLower.includes('success')) type = 'success';
    window.showToast(message, type);
};
// ===================================
