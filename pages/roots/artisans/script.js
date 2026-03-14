document.addEventListener('DOMContentLoaded', () => {
    // 1. Dropdown Logic (Navbar)
    const ourRootsDropdown = document.getElementById('our-roots-dropdown');
    if (ourRootsDropdown) {
        const toggleBtn = ourRootsDropdown.querySelector('.dropdown-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = ourRootsDropdown.classList.toggle('active');
                toggleBtn.setAttribute('aria-expanded', isActive);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!ourRootsDropdown.contains(e.target)) {
                    ourRootsDropdown.classList.remove('active');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // 1.5 Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarNav = document.querySelector('.navbar__nav');

    if (mobileMenuBtn && navbarNav) {
        mobileMenuBtn.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
        });
    }

    // 2. Custom Select Logic (Craftsmanship Dropdown)
    const customSelect = document.getElementById('fabric-custom-select');
    if (customSelect) {
        const toggleBtn = customSelect.querySelector('.custom-select-toggle');
        const valueSpan = customSelect.querySelector('.custom-select-value');
        const items = customSelect.querySelectorAll('.custom-select-item');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                valueSpan.textContent = item.textContent;
                customSelect.classList.remove('open');
                // Could call filter functions here based on item.dataset.value
            });
        });

        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // 3. Hero Carousel Logic
    const heroImage = document.querySelector('.hero-image');
    const leftBtn = document.querySelector('.slider-btn-left');
    const rightBtn = document.querySelector('.slider-btn-right');
    const dots = document.querySelectorAll('.slider-dots .dot');

    // Sample images mapped to dots
    const images = [
        "carouselImages/carousel1.png",
        "carouselImages/carousel2.png",
        "carouselImages/carousel3.png"
    ];
    let currentIndex = 0;

    const updateCarousel = (direction = 'right') => {
        setTimeout(() => {
            if (heroImage) {
                heroImage.style.transition = 'none';
                heroImage.style.transform = 'none';
                heroImage.src = images[currentIndex];
            }
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }, 150); // Delay before instant swap
    };

    let autoPlayInterval;

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel('right');
        }, 3000);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };

    if (leftBtn) {
        leftBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel('left');
            startAutoPlay();
        });
    }

    if (rightBtn) {
        rightBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel('right');
            startAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentIndex === index) return;
            const direction = index > currentIndex ? 'right' : 'left';
            currentIndex = index;
            updateCarousel(direction);
            startAutoPlay();
        });
    });

    // Start auto-play initially
    if (heroImage) {
        startAutoPlay();
    }
});
