/**
 * Revanth - Portfolio Interactive Controller
 * High-performance, modular scripts for visual effects and UI state.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // INTRO PRELOADER TRANSITION LOGIC
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const minPlayTime = 2200; // Play preloader drawing loops for 2.2s minimum
        const startTime = Date.now();

        // Monospace percentage counter incrementation
        const counterEl = preloader.querySelector('.preloader-counter');
        if (counterEl) {
            let count = 0;
            const targetCount = 100;
            const counterInterval = setInterval(() => {
                count++;
                if (count >= targetCount) {
                    count = targetCount;
                    clearInterval(counterInterval);
                }
                counterEl.textContent = count < 10 ? '0' + count : count;
            }, 18); // 18ms * 100 steps = 1.8 seconds roll duration
        }

        const fadeOutPreloader = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minPlayTime - elapsedTime);

            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1300); // Match panel slide animation duration (1.2s) plus buffer
            }, remainingTime);
        };

        window.addEventListener('load', fadeOutPreloader);
        // Fallback in case resource loading hangs
        setTimeout(fadeOutPreloader, 4000);
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // THEME SWITCHER LOGIC
    // ==========================================
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Load saved preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon(true);
    } else {
        body.classList.remove('light-mode');
        updateThemeIcon(false);
    }

    themeBtn.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-mode');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
        updateThemeIcon(isLight);
        
        // Re-draw canvas or particles to match theme colors immediately
        initCanvasThemeColors();
    });

    function updateThemeIcon(isLight) {
        if (!themeIcon) return;
        if (isLight) {
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({
                attrs: { id: 'theme-icon' },
                nameAttr: 'data-lucide'
            });
        }
    }

    // ==========================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================
    const mobileBtn = document.getElementById('mobile-btn');
    const navLinks = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon between menu and x
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                const isOpen = navLinks.classList.contains('active');
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });

        // Close menu when clicking any nav link
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // ==========================================
    // ACTIVE SECTION HIGHLIGHT ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let currentSectionId = 'hero';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === `#${currentSectionId}`) {
                anchor.classList.add('active');
            }
        });
    });

    // ==========================================
    // HERO AUTO-CYCLING TYPEWRITER EFFECT
    // ==========================================
    const typedTextSpan = document.querySelector('.typed-text');
    const roles = [
        "Full-Stack Web Developer",
        "Engineering Student (8.90 GPA)",
        "Java / Spring Boot Architect",
        "Oracle Database Specialist"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typedTextSpan) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Erase faster
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Full word typed, pause before erase
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Brief pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Launch typewriter
    if (typedTextSpan) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================
    // PROJECT DYNAMIC SCHEMATIC EXPANSION
    // ==========================================
    const toggleButtons = document.querySelectorAll('.toggle-arch-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.project-card');
            if (!card) return;

            const isExpanded = card.classList.toggle('expanded');
            
            // Adjust button inner text and icon
            if (isExpanded) {
                button.innerHTML = `<i data-lucide="eye-off"></i> Hide Architecture`;
            } else {
                button.innerHTML = `<i data-lucide="network"></i> View Architecture`;
            }
            
            // Re-render lucide inside button
            lucide.createIcons();
            
            // Smoothly scroll card into view if expanded
            if (isExpanded) {
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });

    // ==========================================
    // INTERACTIVE CANVAS BACKGROUND ANIMATION
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = 70;
    let connectionDistance = 115;
    let mouse = { x: null, y: null, radius: 150 };
    let particleColor = 'rgba(0, 240, 255, 0.45)';
    let lineColor = 'rgba(0, 240, 255, 0.08)';

    // Adjust count based on screen size to preserve performance
    if (window.innerWidth < 768) {
        particleCount = 30;
        connectionDistance = 85;
    }

    function initCanvasThemeColors() {
        const isLight = document.body.classList.contains('light-mode');
        if (isLight) {
            particleColor = 'rgba(37, 99, 235, 0.35)'; // Electric Blue
            lineColor = 'rgba(37, 99, 235, 0.06)';
        } else {
            particleColor = 'rgba(0, 240, 255, 0.45)'; // Cyber Cyan
            lineColor = 'rgba(0, 240, 255, 0.08)';
        }
    }
    
    // Set initial colors
    initCanvasThemeColors();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Cursor gravity interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.hypot(dx, dy);
                
                if (distance < mouse.radius) {
                    // Soft force pushing particles away
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (dx / distance) * force * 1.8;
                    this.y -= (dy / distance) * force * 1.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < connectionDistance) {
                    // Connect with transparent line
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    // Track Cursor
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    animate();

    // ==========================================
    // CONTACT FORM SUBMISSION HANDLER
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clean state
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            // Extract inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Verification checks
            if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                showStatus('Please fill in all the contact form fields.', 'error');
                return;
            }

            if (!validateEmail(emailInput.value)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Lock submit button with animated sending state
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner" style="display: inline-block; width: 14px; height: 14px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 0.5rem; vertical-align: middle;"></span> Launching Client...`;

            // Inject custom spinner rotation keyframe if not present
            if (!document.getElementById('spinner-keyframe')) {
                const styleSheet = document.createElement("style");
                styleSheet.id = 'spinner-keyframe';
                styleSheet.innerText = `@keyframes spin { to { transform: rotate(360deg); } }`;
                document.head.appendChild(styleSheet);
            }

            // Simulate server network latency and trigger mail client launch
            setTimeout(() => {
                const subject = subjectInput.value;
                const name = nameInput.value;
                const email = emailInput.value;
                const message = messageInput.value;

                const bodyText = `Hi Revanth Vardhan,\n\nYou have received a new contact message from your portfolio website:\n\n-------------------------------\nSender Name: ${name}\nSender Email: ${email}\nSubject: ${subject}\n-------------------------------\n\nMessage Details:\n${message}\n\nSent via Revanth's Glassmorphic Portfolio.`;

                // Launch direct Gmail compose in a new tab with pre-filled details
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=yasalapurevanth97@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
                window.open(gmailUrl, '_blank');

                // Success feedback
                showStatus("Success! Your browser's Gmail compose client has been launched in a new tab with your message pre-filled. Please hit 'Send' inside Gmail to complete delivery directly to Revanth.", 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.classList.add(type);
        formStatus.style.display = 'block';
    }

    // ==========================================================================
    // CREATIVE OVERHAUL SCRIPTS (PREMIUM LOOKS & FLYING ANIMATIONS SCRIPTS)
    // ==========================================================================



    // 2. INTERACTIVE MOUSE-TILT CALCULATOR (3D FLIGHT EFFECTS)
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (tiltElements.length > 0) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                
                // Get mouse coordinates relative to element center
                const relativeX = e.clientX - rect.left;
                const relativeY = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max tilting rotation degrees: 8
                const maxTilt = 8;
                const rotationX = -((relativeY - centerY) / centerY) * maxTilt;
                const rotationY = ((relativeX - centerX) / centerX) * maxTilt;

                // Smoothly transform matrix with GPU acceleration
                el.style.transform = `perspective(1000px) rotateX(${rotationX.toFixed(2)}deg) rotateY(${rotationY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;
            });

            el.addEventListener('mouseleave', () => {
                // Return smoothly to base coordinates
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // 3D Profile Card Tilt (Precision CSS Custom Property Driver)
    const profileTiltEl = document.querySelector('[data-profile-tilt]');
    if (profileTiltEl) {
        profileTiltEl.addEventListener('mousemove', (e) => {
            const rect = profileTiltEl.getBoundingClientRect();
            
            // Get mouse coordinates relative to element center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Maximum tilt angle (in degrees)
            const maxTilt = 10;
            
            // Calculate rotations (X rotates around horizontal axis, Y around vertical axis)
            const rotationX = -((y - centerY) / centerY) * maxTilt;
            const rotationY = ((x - centerX) / centerX) * maxTilt;
            
            // Set CSS custom variables smoothly
            profileTiltEl.style.setProperty('--tilt-x', rotationX.toFixed(2));
            profileTiltEl.style.setProperty('--tilt-y', rotationY.toFixed(2));
        });
        
        profileTiltEl.addEventListener('mouseleave', () => {
            // Smoothly reset tilt back to zero
            profileTiltEl.style.setProperty('--tilt-x', '0');
            profileTiltEl.style.setProperty('--tilt-y', '0');
        });
    }

    // 3. SCROLL-REVEAL OBSERVER ENGINE
    const revealTargets = document.querySelectorAll('[class*="reveal-"]');
    if (revealTargets.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');

                    // Cascade: Animate inner progress metrics inside honeycomb grids
                    const progressBars = entry.target.querySelectorAll('.proficiency-bar');
                    if (progressBars.length > 0) {
                        progressBars.forEach(bar => {
                            const percent = bar.getAttribute('data-percent');
                            if (percent) {
                                // Add slight stagger delays to grid renders
                                setTimeout(() => {
                                    bar.style.width = percent;
                                }, 250);
                            }
                        });
                    }

                    // Release observers to lock layout transitions
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -8% 0px' // Trigger slightly before scrolling sections completely inside view
        });

        revealTargets.forEach(target => revealObserver.observe(target));
    }

    // 4. PHYSICS SPARKLES ENGINE (FLYING CLICK PARTICLES EXPLOSION)
    const sparklesCanvas = document.createElement('canvas');
    sparklesCanvas.id = 'click-spark-canvas';
    document.body.appendChild(sparklesCanvas);
    const sCtx = sparklesCanvas.getContext('2d');

    let clickSparks = [];

    function handleResizeSparkles() {
        sparklesCanvas.width = window.innerWidth;
        sparklesCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResizeSparkles);
    handleResizeSparkles();

    // Staggered Particle Constructor
    class ClickSparkParticle {
        constructor(x, y, particleColor) {
            this.x = x;
            this.y = y;
            this.color = particleColor;
            
            // Random radial velocity trajectories
            const angle = Math.random() * Math.PI * 2;
            const initialVelocity = Math.random() * 5 + 3.5;
            this.vx = Math.cos(angle) * initialVelocity;
            this.vy = Math.sin(angle) * initialVelocity;

            this.gravityForce = 0.2;
            this.frictionDrag = 0.95;
            this.alpha = 1;
            this.decaySpeed = Math.random() * 0.025 + 0.02; // Fade speed
            this.radiusSize = Math.random() * 3 + 1.5;
        }

        update() {
            // Apply physics drag and gravitational pulling
            this.vx *= this.frictionDrag;
            this.vy *= this.frictionDrag;
            this.vy += this.gravityForce;
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Fade out
            this.alpha -= this.decaySpeed;
        }

        draw() {
            sCtx.save();
            sCtx.globalAlpha = this.alpha;
            sCtx.beginPath();
            sCtx.arc(this.x, this.y, this.radiusSize, 0, Math.PI * 2);
            sCtx.fillStyle = this.color;
            sCtx.shadowBlur = 8;
            sCtx.shadowColor = this.color;
            sCtx.fill();
            sCtx.restore();
        }
    }

    // Capture user clicks and ignite particles
    window.addEventListener('mousedown', (e) => {
        const isLightModeActive = document.body.classList.contains('light-mode');
        // Elegant palettes matching active themes
        const particleColors = isLightModeActive
            ? ['#2563eb', '#db2777', '#f59e0b', '#10b981'] // Electric blue, orchid pink, orange, emerald green
            : ['#00f0ff', '#bd00ff', '#f59e0b', '#00ff66']; // Cyber cyan, cosmic purple, gold, lime green
        
        const count = Math.floor(Math.random() * 10) + 16;
        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * particleColors.length);
            clickSparks.push(new ClickSparkParticle(e.clientX, e.clientY, particleColors[index]));
        }
    });

    // Particle render loop
    function renderClickSparks() {
        sCtx.clearRect(0, 0, sparklesCanvas.width, sparklesCanvas.height);
        
        // Remove dead sparks from system memory
        clickSparks = clickSparks.filter(spark => spark.alpha > 0);
        
        clickSparks.forEach(spark => {
            spark.update();
            spark.draw();
        });

        requestAnimationFrame(renderClickSparks);
    }
    requestAnimationFrame(renderClickSparks);




    // ==========================================
    // INTERACTIVE PROFILE PHOTO CUSTOMIZER (DISABLED)
    // ==========================================
    const profileDisplayImg = document.getElementById('profile-display-img');

    // Load custom profile photo from localStorage if cached
    const savedPhoto = localStorage.getItem('revanth-profile-photo');
    if (savedPhoto && profileDisplayImg) {
        profileDisplayImg.src = savedPhoto;
    }
});
