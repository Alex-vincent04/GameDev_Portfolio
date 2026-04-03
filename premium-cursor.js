(function() {
    // Only run on non-touch devices (desktop)
    if (window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            cursor: none !important;
        }
        #custom-cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 8px; height: 8px;
            background-color: var(--accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: opacity 0.2s, background-color 0.2s;
        }
        #custom-cursor-ring {
            position: fixed;
            top: 0; left: 0;
            width: 32px; height: 32px;
            border: 1.5px solid var(--accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s, opacity 0.2s;
        }
        .cursor-hover #custom-cursor-ring {
            width: 48px;
            height: 48px;
            background-color: rgba(200, 75, 47, 0.1);
            border-color: transparent;
        }
        [data-theme="dark"] .cursor-hover #custom-cursor-ring {
            background-color: rgba(217, 95, 63, 0.15);
        }
        .cursor-hover #custom-cursor-dot {
            opacity: 0; /* Optional: hide the dot when hovering inside a big button area */
        }
    `;
    document.head.appendChild(style);

    // Create cursor elements
    const dot = document.createElement('div');
    dot.id = 'custom-cursor-dot';
    const ring = document.createElement('div');
    ring.id = 'custom-cursor-ring';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isInitialized = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isInitialized) {
            ringX = mouseX;
            ringY = mouseY;
            isInitialized = true;
        }
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    const animate = () => {
        if (isInitialized) {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animate);
    };
    animate();

    // Add hover effect listeners to interactive elements
    const setupHoverListeners = () => {
        const interactives = document.querySelectorAll('a, button, input, textarea, select, [role="button"], [role="tab"], .theme-toggle, .btn, .btn-ghost, .btn-details, .tab-btn, .dot-nav-link');
        interactives.forEach(el => {
            if (el.dataset.cursorSetup) return;
            el.dataset.cursorSetup = "true";
            
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    };

    // Initialize and observe future DOM changes
    setupHoverListeners();
    const observer = new MutationObserver(setupHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
})();
