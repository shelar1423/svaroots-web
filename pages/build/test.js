document.addEventListener('DOMContentLoaded', () => {
    let arStream = null;

    // Helper to log interactions
    const logInteraction = (message) => {
        console.log(`Interaction: ${message}`);
    };

    // ── Toast notification ──────────────────────────────────────────────────
    function showToast(message, isSuccess = true) {
        // Remove any existing toast
        const existingToast = document.getElementById('save-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'save-toast';
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: isSuccess ? '#2E7D32' : '#C62828',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none',
            fontFamily: 'inherit'
        });
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Animate out after 3 s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ── Collect current design selections ───────────────────────────────────
    function getCurrentDesign() {
        // Gender
        const activeGender = document.querySelector('.gender-tab--active');
        const gender = activeGender ? activeGender.textContent.trim() : '';

        // Size
        const activeSize = document.querySelector('.size-btn--active');
        const sneaker_size = activeSize ? activeSize.textContent.trim() : '';

        // Sneaker base color
        const activeColor = document.querySelector('.color-swatch--active');
        const sneaker_color = activeColor ? (activeColor.getAttribute('aria-label') || activeColor.id.replace('color-', '')) : '';

        // Fabric / Category — first option-section that contains category-label
        const categorySection = document.querySelector('[aria-labelledby="category-label"]');
        let fabric = '';
        if (categorySection) {
            const activeItem = categorySection.querySelector('.image-item--active');
            if (activeItem) {
                const wrapper = activeItem.closest('.image-item-wrapper');
                const nameSpan = wrapper ? wrapper.querySelector('.image-name') : null;
                fabric = nameSpan ? nameSpan.textContent.trim() : (activeItem.alt || '');
            }
        }

        // Motif
        const motifSection = document.querySelector('[aria-labelledby="motif-label"]');
        let motif = '';
        if (motifSection) {
            const activeItem = motifSection.querySelector('.image-item--active');
            if (activeItem) {
                const wrapper = activeItem.closest('.image-item-wrapper');
                const nameSpan = wrapper ? wrapper.querySelector('.image-name') : null;
                motif = nameSpan ? nameSpan.textContent.trim() : (activeItem.alt || '');
            }
        }

        // Lace
        const laceSection = document.querySelector('[aria-labelledby="lace-label"]');
        let lace = '';
        if (laceSection) {
            const activeItem = laceSection.querySelector('.image-item--active');
            if (activeItem) {
                const wrapper = activeItem.closest('.image-item-wrapper');
                const nameSpan = wrapper ? wrapper.querySelector('.image-name') : null;
                lace = nameSpan ? nameSpan.textContent.trim() : (activeItem.alt || '');
            }
        }

        // Background color (aria-label of last clicked bg-btn, stored in a variable)
        const background_color = window._selectedBackground || '';

        return { gender, sneaker_size, sneaker_color, fabric, motif, lace, background_color };
    }

    function resolveCheckoutUrl() {
        if (window.location.pathname.indexOf('/pages/build/') !== -1) {
            return '../shop/gifting/cart-summary.html';
        }
        return '../pages/shop/gifting/cart-summary.html';
    }

    function saveCheckoutDesign() {
        const design = getCurrentDesign();
        const payload = {
            ...design,
            design_name: 'Custom Svaroots Sneaker',
            savedAt: new Date().toISOString()
        };

        localStorage.setItem('svarootsCheckoutDesign', JSON.stringify(payload));
    }

    // 1. Gender tab interactions
    const genderTabs = document.querySelectorAll('.gender-tab');
    genderTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            logInteraction(`Gender tab clicked - ${e.target.textContent}`);
            genderTabs.forEach(t => {
                t.classList.remove('gender-tab--active');
                t.setAttribute('aria-pressed', 'false');
            });
            e.target.classList.add('gender-tab--active');
            e.target.setAttribute('aria-pressed', 'true');
        });
    });

    // 2. Size interactions
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            logInteraction(`Size clicked - ${e.target.textContent}`);
            sizeBtns.forEach(b => b.classList.remove('size-btn--active'));
            e.target.classList.add('size-btn--active');
        });
    });

    // 3. Fabric color interactions
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const colorName = e.target.getAttribute('aria-label') || e.target.id;
            logInteraction(`Fabric color clicked - ${colorName}`);
            colorSwatches.forEach(s => s.classList.remove('color-swatch--active'));
            e.target.classList.add('color-swatch--active');

            const shoeImg = document.querySelector('#shoe-display img');
            if (shoeImg && colorName) {
                let colorKey = colorName.toLowerCase();
                if (colorKey.startsWith('color-')) {
                    colorKey = colorKey.replace('color-', '');
                }
                shoeImg.src = `sneaker-customizer/assets/shoes/${colorKey}.png`;
            }
        });
    });

    // 4. Category, Motif, and Lace interactions
    // These all use the .image-item class within different sections
    const optionSections = document.querySelectorAll('.option-section');
    optionSections.forEach(section => {
        const sectionTitle = section.querySelector('.option-label')?.textContent || 'Unknown Section';
        const imageItems = section.querySelectorAll('.image-item');

        imageItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const itemName = item.nextElementSibling?.textContent || item.alt || 'Unknown Item';
                logInteraction(`${sectionTitle} item clicked - ${itemName}`);

                // Keep only one active item per section
                imageItems.forEach(i => i.classList.remove('image-item--active'));
                item.classList.add('image-item--active');
            });
        });
    });

    // 5. Change background items interactions
    window._selectedBackground = '';
    const bgBtns = document.querySelectorAll('.bg-btn');
    bgBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnName = btn.getAttribute('aria-label') || btn.id || 'Background option';
            logInteraction(`Background item clicked - ${btnName}`);
            window._selectedBackground = btnName;
            // Highlight active bg button
            bgBtns.forEach(b => b.style.outline = '');
            btn.style.outline = '2px solid #1a1a1a';
        });
    });

    // 6. Action Buttons

    // ── Save Design ── persists selections locally for the static integration ──
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            logInteraction('Save button clicked');

            const design = getCurrentDesign();
            design.username = 'guest';      // replace with real username when auth is added
            design.design_name = 'My Design';  // could prompt user in future

            logInteraction('Saving design: ' + JSON.stringify(design));

            // Disable button while saving
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving…';

            try {
                const savedDesigns = JSON.parse(localStorage.getItem('svarootsSavedDesigns') || '[]');
                const entry = {
                    id: Date.now(),
                    savedAt: new Date().toISOString(),
                    ...design
                };

                savedDesigns.push(entry);
                localStorage.setItem('svarootsSavedDesigns', JSON.stringify(savedDesigns));
                showToast('✓ Design saved locally for this browser session.', true);
            } catch (err) {
                console.error('Save error:', err);
                showToast('✗ Could not save this design locally.', false);
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
            }
        });
    }

    const buyNowBtn = document.getElementById('buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logInteraction('Buy Now button clicked');
            saveCheckoutDesign();
            window.location.href = resolveCheckoutUrl();
        });
    }

    const proceedBtn = document.getElementById('proceed-btn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logInteraction('Proceed to Pay button clicked');
            saveCheckoutDesign();
            window.location.href = resolveCheckoutUrl();
        });
    }

    // ── Other action buttons ─────────────────────────────────────────────────
    const otherActionButtons = [
        { id: '#reset-btn', name: 'Reset' },
        { id: '#add-to-cart-btn', name: 'Add to Cart' },
        { id: '#undo-btn', name: 'Undo' },
        { id: '#redo-btn', name: 'Redo' },
        { id: '#zoom-in-btn', name: 'Zoom In' },
        { id: '#zoom-out-btn', name: 'Zoom Out' }
    ];

    otherActionButtons.forEach(action => {
        const btn = document.querySelector(action.id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                logInteraction(`${action.name} button clicked`);
            });
        }
    });

    // 7. Zoom Functionality
    let currentZoom = 1;
    const zoomStep = 0.2;
    const maxZoom = 2.5;
    const minZoom = 0.5;
    const shoeDisplayImg = document.querySelector('#shoe-display img');

    if (shoeDisplayImg) {
        // Add CSS transition for smooth zooming
        shoeDisplayImg.style.transition = 'transform 0.3s ease';

        const zoomInBtn = document.getElementById('zoom-in-btn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (currentZoom < maxZoom) {
                    currentZoom += zoomStep;
                    shoeDisplayImg.style.transform = `scale(${currentZoom})`;
                }
            });
        }

        const zoomOutBtn = document.getElementById('zoom-out-btn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (currentZoom > minZoom) {
                    currentZoom -= zoomStep;
                    shoeDisplayImg.style.transform = `scale(${currentZoom})`;
                }
            });
        }
    }

    // 8. Nav Dropdown Interaction
    const ourRootsDropdown = document.getElementById('our-roots-dropdown');
    if (ourRootsDropdown) {
        const toggleBtn = ourRootsDropdown.querySelector('.dropdown-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = ourRootsDropdown.classList.toggle('active');
                toggleBtn.setAttribute('aria-expanded', isActive);
                logInteraction(`Our Roots dropdown ${isActive ? 'opened' : 'closed'}`);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!ourRootsDropdown.contains(e.target)) {
                    ourRootsDropdown.classList.remove('active');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        const dropdownItems = ourRootsDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                if (!href || href === '#') {
                    e.preventDefault();
                }
                logInteraction(`Dropdown item clicked - ${item.textContent.trim()}`);
                // Close dropdown after selection
                ourRootsDropdown.classList.remove('active');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // 9. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarNav = document.querySelector('.navbar__nav');

    if (mobileMenuBtn && navbarNav) {
        mobileMenuBtn.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
        });
    }

    // 10. AR Try-On Modal
    const tryOnBtn = document.getElementById('tryon-btn');
    const arModal = document.getElementById('ar-tryon-modal');
    const arCloseBtn = document.getElementById('ar-close-btn');
    const arStartBtn = document.getElementById('ar-start-btn');
    const arDemoBtn = document.getElementById('ar-demo-btn');
    const arVideo = document.getElementById('ar-video');
    const arStatus = document.getElementById('ar-status');
    const arShoeOverlay = document.getElementById('ar-shoe-overlay');

    function setArStatus(message, isError = false) {
        if (!arStatus) return;
        arStatus.textContent = message;
        arStatus.style.color = isError ? '#9e1c1c' : '#524f4b';
    }

    function updateArOverlayShoe() {
        const liveShoe = document.querySelector('#shoe-display img');
        if (!liveShoe || !arShoeOverlay) return;
        arShoeOverlay.src = liveShoe.getAttribute('src') || arShoeOverlay.src;
    }

    async function startArCamera() {
        if (!arVideo || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setArStatus('Camera is not supported on this browser. Use demo mode.', true);
            return;
        }

        try {
            arStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });

            arVideo.srcObject = arStream;
            await arVideo.play();
            setArStatus('Camera started. Move your phone/desktop camera to preview the sneaker.');
        } catch (err) {
            console.error('AR camera error:', err);
            setArStatus('Could not access camera. You can continue with demo mode.', true);
        }
    }

    function stopArCamera() {
        if (arStream) {
            arStream.getTracks().forEach(track => track.stop());
            arStream = null;
        }
        if (arVideo) {
            arVideo.srcObject = null;
        }
    }

    function openArModal() {
        if (!arModal) return;
        updateArOverlayShoe();
        arModal.classList.add('is-open');
        arModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setArStatus('Allow camera access to start AR preview.');
    }

    function closeArModal() {
        if (!arModal) return;
        arModal.classList.remove('is-open');
        arModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        stopArCamera();
    }

    if (tryOnBtn && arModal) {
        tryOnBtn.textContent = 'AR Try-On';
        tryOnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logInteraction('AR Try-On opened');
            openArModal();
        });

        arModal.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.getAttribute('data-ar-close') === 'true') {
                closeArModal();
            }
        });

        if (arCloseBtn) {
            arCloseBtn.addEventListener('click', closeArModal);
        }

        if (arStartBtn) {
            arStartBtn.addEventListener('click', async () => {
                logInteraction('AR camera start');
                await startArCamera();
            });
        }

        if (arDemoBtn) {
            arDemoBtn.addEventListener('click', () => {
                stopArCamera();
                setArStatus('Demo mode active. Overlay is synced with your selected sneaker color.');
                logInteraction('AR demo mode');
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && arModal.classList.contains('is-open')) {
                closeArModal();
            }
        });

        const shoeDisplay = document.querySelector('#shoe-display img');
        if (shoeDisplay) {
            const observer = new MutationObserver(updateArOverlayShoe);
            observer.observe(shoeDisplay, { attributes: true, attributeFilter: ['src'] });
        }
    }

});
