// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    welcomeTitle: "Happy Valentine's Day, My Love! 💕",
    welcomeSubtitle: "Mỗi khoảnh khắc bên em đều là món quà quý giá nhất...",
    typingSpeed: 100,
    particles: {
        count: 50,
        hearts: 15,
        petals: 20
    }
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    giftBox: document.getElementById('giftBox'),
    giftScene: document.getElementById('giftScene'),
    contentReveal: document.getElementById('contentReveal'),
    closeBtn: document.getElementById('closeBtn'),
    mainTitle: document.getElementById('mainTitle'),
    subtitle: document.getElementById('subtitle'),
    galleryTrack: document.getElementById('galleryTrack'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    galleryDots: document.getElementById('galleryDots'),
    particlesContainer: document.getElementById('particlesContainer'),
    floatingHearts: document.getElementById('floatingHearts'),
    fallingPetals: document.getElementById('fallingPetals'),
    confettiContainer: document.getElementById('confettiContainer'),
    audioPlayer: document.getElementById('audioPlayer'),
    audioToggle: document.getElementById('audioToggle'),
    bgMusic: document.getElementById('bgMusic')
};

// ============================================
// STATE
// ============================================

let state = {
    currentSlide: 0,
    isBoxOpened: false,
    isAudioPlaying: false
};

// ============================================
// PARTICLE EFFECTS
// ============================================

function createParticles() {
    // Create twinkling particles
    for (let i = 0; i < CONFIG.particles.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        elements.particlesContainer.appendChild(particle);
    }

    // Create floating hearts
    setInterval(() => {
        if (state.isBoxOpened) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
            heart.style.animationDuration = `${6 + Math.random() * 4}s`;
            elements.floatingHearts.appendChild(heart);

            setTimeout(() => heart.remove(), 10000);
        }
    }, 800);

    // Create falling petals
    setInterval(() => {
        if (state.isBoxOpened) {
            const petal = document.createElement('div');
            petal.className = 'falling-petal';
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.animationDuration = `${8 + Math.random() * 4}s`;
            petal.style.animationDelay = `${Math.random() * 2}s`;
            elements.fallingPetals.appendChild(petal);

            setTimeout(() => petal.remove(), 12000);
        }
    }, 600);
}

function createFireworks() {
    const colors = ['#c44569', '#e89bb5', '#ff6b9d', '#ff8fab', '#ffa5bd'];
    const fireworksCount = 6; // Number of firework bursts

    for (let f = 0; f < fireworksCount; f++) {
        setTimeout(() => {
            // Launch position (random around center)
            const launchX = 40 + Math.random() * 20; // 40-60%
            const particlesPerBurst = 30;

            for (let i = 0; i < particlesPerBurst; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';

                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.backgroundColor = color;
                particle.style.color = color;

                // Starting position (center of screen)
                particle.style.left = `${launchX}%`;
                particle.style.top = '60%';

                // Random explosion direction
                const angle = (Math.PI * 2 * i) / particlesPerBurst;
                const velocity = 100 + Math.random() * 150;
                const explodeX = Math.cos(angle) * velocity;
                const explodeY = Math.sin(angle) * velocity - 50; // Bias upward

                particle.style.setProperty('--explode-x', `${explodeX}px`);
                particle.style.setProperty('--explode-y', `${explodeY}px`);

                particle.style.animation = `fireworkExplode ${0.8 + Math.random() * 0.4}s ease-out forwards`;
                particle.style.animationDelay = `${Math.random() * 0.1}s`;

                elements.confettiContainer.appendChild(particle);

                setTimeout(() => particle.remove(), 1500);
            }
        }, f * 200); // Stagger fireworks
    }
}

// ============================================
// TYPING EFFECT
// ============================================

function typeWriter(element, text, speed = CONFIG.typingSpeed) {
    let i = 0;
    element.textContent = '';

    return new Promise((resolve) => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// ============================================
// GIFT BOX INTERACTION
// ============================================

async function openGiftBox() {
    if (state.isBoxOpened) return;

    state.isBoxOpened = true;
    elements.giftBox.classList.add('opening');

    // Create fireworks effect
    setTimeout(() => {
        createFireworks();
    }, 600);

    // Hide gift scene and show content
    setTimeout(() => {
        elements.giftScene.classList.add('hidden');

        setTimeout(() => {
            elements.contentReveal.classList.add('active');
            elements.audioPlayer.classList.add('visible');

            // Start typing animation
            typeWriter(elements.mainTitle, CONFIG.welcomeTitle, 80).then(() => {
                typeWriter(elements.subtitle, CONFIG.welcomeSubtitle, 50);
            });

            // Try to autoplay music (may be blocked by browser)
            tryAutoplayMusic();
        }, 800);
    }, 1500);
}

function closeContent() {
    elements.contentReveal.classList.remove('active');
    elements.audioPlayer.classList.remove('visible');

    setTimeout(() => {
        elements.giftScene.classList.remove('hidden');
        elements.giftBox.classList.remove('opening');
        state.isBoxOpened = false;

        // Clear typed text
        elements.mainTitle.textContent = '';
        elements.subtitle.textContent = '';

        // Pause music
        pauseMusic();
    }, 800);
}

// ============================================
// GALLERY FUNCTIONALITY
// ============================================

function initGallery() {
    const items = document.querySelectorAll('.gallery-item');

    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        elements.galleryDots.appendChild(dot);
    });

    updateGallery();
}

function updateGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const dots = document.querySelectorAll('.dot');

    elements.galleryTrack.style.transform = `translateX(-${state.currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === state.currentSlide);
    });
}

function nextSlide() {
    const items = document.querySelectorAll('.gallery-item');
    state.currentSlide = (state.currentSlide + 1) % items.length;
    updateGallery();
}

function prevSlide() {
    const items = document.querySelectorAll('.gallery-item');
    state.currentSlide = (state.currentSlide - 1 + items.length) % items.length;
    updateGallery();
}

function goToSlide(index) {
    state.currentSlide = index;
    updateGallery();
}

// ============================================
// AUDIO PLAYER
// ============================================

function tryAutoplayMusic() {
    // Try to play music automatically
    // Note: Most browsers block autoplay with sound
    elements.bgMusic.play()
        .then(() => {
            state.isAudioPlaying = true;
            elements.audioToggle.classList.add('playing');
        })
        .catch(() => {
            // Autoplay was blocked, user needs to click
            console.log('Autoplay blocked - user needs to click play');
        });
}

function toggleMusic() {
    if (state.isAudioPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    elements.bgMusic.play()
        .then(() => {
            state.isAudioPlaying = true;
            elements.audioToggle.classList.add('playing');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
        });
}

function pauseMusic() {
    elements.bgMusic.pause();
    state.isAudioPlaying = false;
    elements.audioToggle.classList.remove('playing');
}

// ============================================
// SMOOTH SCROLL
// ============================================

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function observeElements() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        }
    );

    document.querySelectorAll('section, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (!state.isBoxOpened) return;

        switch(e.key) {
            case 'ArrowLeft':
                prevSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
            case 'Escape':
                closeContent();
                break;
        }
    });
}

// ============================================
// MOBILE TOUCH GESTURES
// ============================================

function setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    elements.galleryTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    elements.galleryTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Gift box
    elements.giftBox.addEventListener('click', openGiftBox);

    // Close button
    elements.closeBtn.addEventListener('click', closeContent);

    // Gallery navigation
    elements.prevBtn.addEventListener('click', prevSlide);
    elements.nextBtn.addEventListener('click', nextSlide);

    // Audio player
    elements.audioToggle.addEventListener('click', toggleMusic);

    // Auto-advance gallery
    setInterval(() => {
        if (state.isBoxOpened) {
            nextSlide();
        }
    }, 5000);
}

// ============================================
// CUSTOMIZATION HELPERS
// ============================================

// Function to update gallery images
function updateGalleryImages(images) {
    // images should be an array of objects: [{ src: 'path/to/image.jpg', caption: 'Caption text' }]
    const galleryItems = document.querySelectorAll('.gallery-item');

    images.forEach((img, index) => {
        if (galleryItems[index]) {
            const placeholder = galleryItems[index].querySelector('.photo-placeholder');
            const caption = galleryItems[index].querySelector('.photo-caption');

            // Replace placeholder with actual image
            placeholder.innerHTML = `<img src="${img.src}" alt="${img.caption}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">`;

            if (caption && img.caption) {
                caption.textContent = img.caption;
            }
        }
    });
}

// Function to update timeline events
function updateTimeline(events) {
    // events should be an array of objects: [{ date: 'Date', description: 'Event description' }]
    const timeline = document.querySelector('.timeline');
    timeline.innerHTML = '';

    events.forEach((event, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h3 class="timeline-date">${event.date}</h3>
                <p>${event.description}</p>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// Function to update love letter
function updateLoveLetter(content) {
    // content should be an object: { greeting: 'Greeting', paragraphs: ['p1', 'p2', ...], closing: 'Closing' }
    const letterContent = document.querySelector('.letter-content');

    let html = `<p class="letter-greeting">${content.greeting}</p>`;

    content.paragraphs.forEach(para => {
        html += `<p>${para}</p>`;
    });

    html += `<p class="letter-closing">${content.closing}</p>`;

    letterContent.innerHTML = html;
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Create particle effects
    createParticles();

    // Initialize gallery
    initGallery();

    // Setup event listeners
    setupEventListeners();

    // Setup keyboard navigation
    setupKeyboardNav();

    // Setup touch gestures for mobile
    setupTouchGestures();

    // Setup smooth scrolling
    smoothScroll();

    // Observe elements for animation
    observeElements();

    console.log('💝 Valentine website initialized!');
    console.log('💡 Tips:');
    console.log('   - Use updateGalleryImages() to add your photos');
    console.log('   - Use updateTimeline() to customize your timeline');
    console.log('   - Use updateLoveLetter() to personalize your letter');
    console.log('   - Add your music file as "romantic-music.mp3"');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// ============================================
// EXAMPLE USAGE (uncomment to use)
// ============================================

/*
// Example: Update gallery with your photos
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateGalleryImages([
            { src: 'photos/photo1.jpg', caption: 'Khoảnh khắc đầu tiên' },
            { src: 'photos/photo2.jpg', caption: 'Kỷ niệm ngọt ngào' },
            { src: 'photos/photo3.jpg', caption: 'Hạnh phúc bên nhau' },
            { src: 'photos/photo4.jpg', caption: 'Yêu thương mỗi ngày' }
        ]);
    }, 100);
});

// Example: Update timeline
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateTimeline([
            { date: '15/08/2023', description: 'Ngày đầu tiên gặp nhau tại quán cà phê...' },
            { date: '20/09/2023', description: 'Lần đầu đi xem phim cùng nhau...' },
            { date: '14/10/2023', description: 'Chính thức yêu nhau dưới trời thu...' },
            { date: '14/02/2024', description: 'Valentine đầu tiên của chúng mình!' }
        ]);
    }, 100);
});

// Example: Update love letter
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateLoveLetter({
            greeting: 'Gửi người con gái tuyệt vời nhất,',
            paragraphs: [
                'Từ ngày có em...',
                'Anh biết rằng...',
                'Valentine này...'
            ],
            closing: 'Mãi yêu em,<br>Người của em ❤️'
        });
    }, 100);
});
*/
