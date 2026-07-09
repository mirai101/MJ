document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initNavHighlight();
    initResponsiveAnimations();
    handleOrientationChange();
    initGridInteraction();
    initBackToTop();
    initProjectFilters();
    initScrollProgress();
    initCopyButtons();
});

function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    if (!copyButtons.length) return;

    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.dataset.copy;
            const icon = this.querySelector('i');

            function showCopied() {
                this.classList.add('copied');
                if (icon) icon.className = 'fas fa-check';
                setTimeout(() => {
                    this.classList.remove('copied');
                    if (icon) icon.className = 'fas fa-copy';
                }, 1500);
            }
            const restoreBound = showCopied.bind(this);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value).then(restoreBound).catch(() => {});
            } else {
                
                const textarea = document.createElement('textarea');
                textarea.value = value;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    restoreBound();
                } catch (e) {
                    
                }
                document.body.removeChild(textarea);
            }
        });
    });
}

function initProjectFilters() {
    const filterBar = document.getElementById('projectFilters');
    const grid = document.getElementById('projectsGrid');
    if (!filterBar || !grid) return;

    const buttons = filterBar.querySelectorAll('.filter-btn');
    const cards = grid.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;

            buttons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            cards.forEach(card => {
                const matches = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !matches);
            });
        });
    });
}

function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeToggle) return;

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeColorMeta) themeColorMeta.setAttribute('content', '#0b0b0c');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeColorMeta) themeColorMeta.setAttribute('content', '#1a1a1a');
        }
    }

    
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current);

    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {
            
        }
    });

    
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initGridInteraction() {
    const gridAnimation = document.querySelector('.grid-animation');
    if (!gridAnimation) return;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = mouseX + 'px';
        ripple.style.top = mouseY + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 0.15)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';
        ripple.style.transform = 'translate(-50%, -50%)';

        gridAnimation.appendChild(ripple);

        
        let size = 0;
        const animation = setInterval(() => {
            size += 2;
            ripple.style.boxShadow = `0 0 0 ${size}px rgba(0, 0, 0, ${0.15 - size * 0.002})`;

            if (size > 60) {
                clearInterval(animation);
                ripple.remove();
            }
        }, 30);
    });
}

function handleOrientationChange() {
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            const navLinks = document.getElementById('navLinks');
            const menuToggle = document.getElementById('menuToggle');
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }, 100);
    });
}

function initResponsiveAnimations() {
    const updateAnimations = () => {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            if (isMobile) {
                card.style.animationDelay = '0s';
            } else {
                card.style.animationDelay = `${index * 0.1}s`;
            }
        });
    };

    updateAnimations();
    window.addEventListener('resize', updateAnimations);
}

function initMagnifierCursor() {
    const magnifier = document.createElement('div');
    magnifier.className = 'magnifier-cursor';
    document.body.appendChild(magnifier);

    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let targetX = 0;
    let targetY = 0;
    let isTouch = false;

    
    function isTouchDevice() {
        return window.matchMedia('(hover: none)').matches || 
               window.matchMedia('(pointer: coarse)').matches ||
               ('ontouchstart' in window);
    }

    
    if (isTouchDevice()) {
        magnifier.style.display = 'none';
        isTouch = true;
        return;
    }

    
    function updateCursorPosition() {
        const speed = 0.15; 
        mouseX += (targetX - mouseX) * speed;
        mouseY += (targetY - mouseY) * speed;
        
        magnifier.style.left = (mouseX - 20) + 'px';
        magnifier.style.top = (mouseY - 20) + 'px';
        
        requestAnimationFrame(updateCursorPosition);
    }

    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
        
        if (!isMoving) {
            isMoving = true;
            magnifier.style.opacity = '1';
            updateCursorPosition();
        }
    });

    document.addEventListener('mouseleave', function() {
        magnifier.style.opacity = '0';
        isMoving = false;
    });

    document.addEventListener('mouseenter', function() {
        if (!isTouch) {
            magnifier.style.opacity = '1';
            isMoving = true;
        }
    });

    
    document.addEventListener('mousedown', function() {
        if (!isTouch && magnifier.classList.contains('hover')) {
            magnifier.style.transform = 'scale(0.9)';
        }
    });

    document.addEventListener('mouseup', function() {
        if (!isTouch && magnifier.classList.contains('hover')) {
            magnifier.style.transform = 'scale(1)';
        }
    });

    
    const interactiveElements = document.querySelectorAll('a, button, .btn, .link, .social-link, .project-btn, .tag, .skill-tag, .role-tag');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!isTouch) {
                magnifier.classList.add('hover');
                if (element.closest('.project-card')) {
                    magnifier.setAttribute('data-label', 'VIEW');
                }
            }
        });
        element.addEventListener('mouseleave', function() {
            if (!isTouch) {
                magnifier.classList.remove('hover');
                magnifier.removeAttribute('data-label');
            }
        });
    });

    
    updateCursorPosition();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const offsetTop = target.offsetTop - navHeight - 10;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                
                const navLinks = document.getElementById('navLinks');
                const menuToggle = document.getElementById('menuToggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    
    document.querySelectorAll('.project-card, .skill-category, .expertise-item, .contact-method').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
                link.style.color = 'var(--primary)';
            } else {
                link.style.color = 'var(--light)';
            }
        });
    });
}

let parallaxEnabled = window.innerWidth > 768;

window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero && parallaxEnabled) {
        const scrollPosition = window.scrollY;
        hero.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    }
});

window.addEventListener('resize', function() {
    parallaxEnabled = window.innerWidth > 768;
    if (!parallaxEnabled) {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = 'translateY(0)';
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const menuToggle = document.getElementById('menuToggle');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const throttledScroll = throttle(function() {
    
}, 100);

window.addEventListener('scroll', throttledScroll);

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

if (window.matchMedia('(hover: none)').matches) {
    const cursor = document.querySelector('.magnifier-cursor');
    if (cursor) {
        cursor.style.display = 'none';
    }
}

function optimizeViewport() {
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 1024;
    
    if (isMobile) {
        document.documentElement.style.fontSize = '14px';
    } else if (isTablet) {
        document.documentElement.style.fontSize = '16px';
    } else {
        document.documentElement.style.fontSize = '16px';
    }
}

optimizeViewport();
window.addEventListener('resize', optimizeViewport);
