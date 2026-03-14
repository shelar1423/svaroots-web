// ============================================================
//  SVAROOTS CAREERS LANDING PAGE — JavaScript Interactions
//  Interaction 1: Scroll Animation — value cards fade in
//  Interaction 2: Hover Effect — value cards lift up
//  Interaction 3: Footer Email Subscribe validation
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // INTERACTION 1 — SCROLL ANIMATION
  // Value cards fade in one by one as user scrolls down
  // ============================================================

  const valueCards = document.querySelectorAll('.value-card');

  // Step 1 — Set starting state for all cards
  // Cards start invisible and slightly below their final position
  valueCards.forEach(function (card, index) {
    card.style.opacity    = '0';              // invisible
    card.style.transform  = 'translateY(40px)'; // shifted down 40px
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    // Each card has a slight delay so they appear one by one
    // index 0 = 0ms, index 1 = 100ms, index 2 = 200ms etc.
    card.style.transitionDelay = (index * 100) + 'ms';
  });

  // Step 2 — Create an IntersectionObserver
  // This watches each card and fires when it enters the screen
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Card is now visible on screen — animate it in
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        // Stop watching this card — animation only happens once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15  // trigger when 15% of the card is visible
  });

  // Step 3 — Tell the observer to watch each card
  valueCards.forEach(function (card) {
    observer.observe(card);
  });


  // ============================================================
  // INTERACTION 2 — HOVER EFFECT
  // Value cards lift up and show a subtle shadow on hover
  // ============================================================

  valueCards.forEach(function (card) {

    // Add base styles to card for smooth transition
    card.style.borderRadius = '12px';
    card.style.padding      = '20px';
    card.style.cursor       = 'default';

    // When mouse enters the card
    card.addEventListener('mouseenter', function () {
      this.style.transform  = 'translateY(-8px)';         // lift up
      this.style.boxShadow  = '0 12px 32px rgba(164, 33, 0, 0.12)'; // warm shadow
      this.style.background = '#fdf5f3';                  // soft terracotta tint
      this.style.transition = 'all 0.3s ease';
    });

    // When mouse leaves the card
    card.addEventListener('mouseleave', function () {
      this.style.transform  = 'translateY(0)';   // back to original position
      this.style.boxShadow  = 'none';            // remove shadow
      this.style.background = 'transparent';     // back to original bg
      this.style.transition = 'all 0.3s ease';
    });

  });


  // ============================================================
  // INTERACTION 3 — FOOTER EMAIL SUBSCRIBE
  // Same validation as careers form page
  // ============================================================

  const footerEmailInput = document.querySelector('.footer-email-row input');
  const footerBtn        = document.querySelector('.footer-email-row button');
  const footerEmailRow   = document.querySelector('.footer-email-row');

  if (footerBtn && footerEmailInput) {

    footerBtn.addEventListener('click', function () {
      const email      = footerEmailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Remove any previous message
      const existing = document.getElementById('subscribeMsg');
      if (existing) existing.remove();

      // Create feedback message element
      const msg = document.createElement('p');
      msg.id = 'subscribeMsg';
      msg.style.cssText = `
        font-family: 'Nunito Sans', sans-serif;
        font-size: 13px;
        margin-top: 8px;
      `;

      if (email === '') {
        // Empty
        msg.textContent = 'Please enter your email address.';
        msg.style.color = '#ff8a80';
        footerEmailRow.style.borderColor = '#ff8a80';

      } else if (!emailRegex.test(email)) {
        // Wrong format
        msg.textContent = "That doesn't look like a valid email.";
        msg.style.color = '#ff8a80';
        footerEmailRow.style.borderColor = '#ff8a80';

      } else {
        // Valid!
        msg.textContent = "🎉 You're subscribed! Welcome to Svaroots.";
        msg.style.color = '#a5d6a7';
        footerEmailRow.style.borderColor = '#a5d6a7';
        footerEmailInput.value = ''; // clear input
      }

      // Insert message below the email row
      footerEmailRow.parentNode.insertBefore(msg, footerEmailRow.nextSibling);

      // Auto remove after 4 seconds
      setTimeout(function () {
        msg.remove();
        footerEmailRow.style.borderColor = '';
      }, 4000);
    });

    // Clear error when user starts typing again
    footerEmailInput.addEventListener('input', function () {
      footerEmailRow.style.borderColor = '';
      const msg = document.getElementById('subscribeMsg');
      if (msg) msg.remove();
    });
  }

});
// ============================================================
//  END OF FILE
// ============================================================