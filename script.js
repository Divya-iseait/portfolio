/**
 * Portfolio JavaScript - Interactivity & Theme Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Theme (Dark / Night Mode) Controller
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Check saved theme in localStorage or detect system preference with CSS media query
    const savedTheme = localStorage.getItem('portfolio-theme');
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    }

    // Listen to live system browser theme changes
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            applyTheme(targetTheme);
            localStorage.setItem('portfolio-theme', targetTheme);
        });
    }

    // --------------------------------------------------------------------------
    // 2. Mobile Navigation Toggle
    // --------------------------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (mobileMenuToggle && primaryNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('nav-open');
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close mobile menu when clicking any nav link
        const navLinks = primaryNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('nav-open')) {
                    primaryNav.classList.remove('nav-open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --------------------------------------------------------------------------
    // 3. Dynamic Year in Footer
    // --------------------------------------------------------------------------
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------------------------
    // 4. Scroll Active Navigation Link Highlight
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.primary-nav .nav-link');

    const highlightNavOnScroll = () => {
        const scrollY = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    // --------------------------------------------------------------------------
    // 5. Animated Skill Progress Bars On Scroll
    // --------------------------------------------------------------------------
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    if ('IntersectionObserver' in window && skillBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.style.getPropertyValue('--target-width') || '85%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillBars.forEach(bar => {
            bar.style.width = '0%';
            progressObserver.observe(bar);
        });
    }

    // --------------------------------------------------------------------------
    // 6. Project Thumbnail Lightbox Modal Controller & Connectivity
    // --------------------------------------------------------------------------
    // EXPLANATION OF THUMBNAIL-TO-DETAIL CONNECTIVITY:
    // 1. Each project thumbnail (.project-thumbnail-wrapper) encapsulates custom data attributes:
    //    - 'data-img-src': High-resolution image path for the expanded preview.
    //    - 'data-project-title': Heading of the selected project.
    //    - 'data-project-desc': Comprehensive technical explanation of the project.
    //    - 'data-project-link': Source code repository or live deployment link.
    // 2. The event listeners below extract these attributes when a user clicks a thumbnail
    //    or presses Enter/Space on a focused thumbnail.
    // 3. The extracted details are then injected into the DOM elements of '#project-modal'.
    // 4. Modal is displayed with smooth CSS transitions, and background scroll is locked.
    // --------------------------------------------------------------------------
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-project-img');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDesc = document.getElementById('modal-project-desc');

    const openModal = (imgSrc, title, desc) => {
        if (!projectModal) return;
        
        // Inject dynamic project details into modal DOM elements
        if (modalImg) {
            modalImg.src = imgSrc || '';
            modalImg.alt = `${title || 'Project'} Full Preview`;
        }
        if (modalTitle) {
            modalTitle.textContent = title || 'Project Details';
        }
        if (modalDesc) {
            modalDesc.textContent = desc || 'Detailed view of the software engineering and academic project.';
        }

        // Display modal with open class and update accessibility state
        projectModal.classList.add('is-open');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling while modal is open
    };

    const closeModal = () => {
        if (!projectModal) return;
        projectModal.classList.remove('is-open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    // Connect Clickable Thumbnail Wrappers to Project Detail Modal
    const thumbnailWrappers = document.querySelectorAll('.project-thumbnail-wrapper');
    thumbnailWrappers.forEach(wrapper => {
        const handleTrigger = () => {
            // Extract project metadata from thumbnail data attributes or child elements
            const imgSrc = wrapper.getAttribute('data-img-src') || wrapper.querySelector('img')?.src;
            const title = wrapper.getAttribute('data-project-title') || wrapper.closest('.project-card-modern')?.querySelector('.project-card-title')?.textContent;
            const desc = wrapper.getAttribute('data-project-desc') || wrapper.closest('.project-card-modern')?.querySelector('.project-card-desc')?.textContent;
            openModal(imgSrc, title, desc);
        };

        // Trigger detail view on click
        wrapper.addEventListener('click', handleTrigger);
        
        // Keyboard Accessibility: Trigger detail view on Enter or Space key
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTrigger();
            }
        });
    });

    // Connect explicit "Preview" buttons to Project Detail Modal
    const previewButtons = document.querySelectorAll('.open-project-modal, .btn-project-preview');
    previewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            openModal(imgSrc, title, desc);
        });
    });

    // Close button click listener
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside the modal box on the backdrop
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
            closeModal();
        }
    });

    window.addEventListener('scroll', highlightNavOnScroll);
});
