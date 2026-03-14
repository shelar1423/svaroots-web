/* ══════════════════════════════════════════
   SVAROOTS — CAREERS PAGE JS
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. SEARCH BAR — focus ring & live filter
  ───────────────────────────────────────── */
  const searchInput = document.querySelector('.search-bar input');
  const searchBar   = document.querySelector('.search-bar');

  if (searchInput && searchBar) {
    searchInput.addEventListener('focus', () => {
      searchBar.style.borderColor = 'var(--red)';
      searchBar.style.boxShadow   = '0 0 0 2px rgba(180,58,31,0.12)';
    });

    searchInput.addEventListener('blur', () => {
      searchBar.style.borderColor = 'var(--border)';
      searchBar.style.boxShadow   = 'none';
    });

    // Live filter: hide job cards whose title doesn't match the query
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      const cards = document.querySelectorAll('.stamp-wrap');

      cards.forEach(card => {
        // Pull job title text from the SVG <text> element at y="162"
        const titleEl = card.querySelector('text[y="162"]');
        if (!titleEl) return;
        const title = titleEl.textContent.toLowerCase();

        if (!query || title.includes(query)) {
          card.style.opacity   = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity   = '0.25';
          card.style.transform = 'scale(0.97)';
        }
        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      });
    });
  }


  /* ─────────────────────────────────────────
     3. JOB CARDS — hover lift & "Read More" click
  ───────────────────────────────────────── */
  const stampWraps = document.querySelectorAll('.stamp-wrap');

  stampWraps.forEach(wrap => {
    wrap.style.cursor     = 'pointer';
    wrap.style.transition = 'transform 0.22s ease, box-shadow 0.22s ease';

    wrap.addEventListener('mouseenter', () => {
      wrap.style.transform  = 'translateY(-6px)';
      wrap.style.boxShadow  = '0 16px 40px rgba(164,33,0,0.14)';
    });

    wrap.addEventListener('mouseleave', () => {
      wrap.style.transform  = 'translateY(0)';
      wrap.style.boxShadow  = 'none';
    });

    // "Read More" button inside SVG — intercept click
    const svgEl = wrap.querySelector('svg');
    if (svgEl) {
      svgEl.addEventListener('click', (e) => {
        // Find the <text> that acts as a button (dominant-baseline="middle")
        const target = e.target.closest('text[dominant-baseline="middle"]');
        if (!target) return;

        const titleEl  = wrap.querySelector('text[y="162"]');
        const jobTitle = titleEl ? titleEl.textContent.trim() : 'this role';
        showJobModal(jobTitle);
      });
    }
  });


  /* ─────────────────────────────────────────
     4. JOB MODAL — lightweight read-more panel
  ───────────────────────────────────────── */
  const jobDetails = {
    'Sr. Product Designer': {
      team:     'Design',
      location: 'Mumbai / Remote',
      type:     'Full-time',
      body:     'Lead product thinking across UX, systems, and storytelling — shaping how culture becomes interactive. You will own end-to-end design for key product surfaces, run user research, and maintain the design system.',
      skills:   ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
    },
    'Textile Researcher': {
      team:     'Research',
      location: 'Field + Mumbai',
      type:     'Contract',
      body:     'Document regional fabrics, decode motif systems, and build an authentic, structured material library for product integration. Requires fieldwork across weaving clusters in India.',
      skills:   ['Ethnographic Research', 'Textile Knowledge', 'Documentation', 'Photography'],
    },
    'Brand Strategist': {
      team:     'Marketing',
      location: 'Mumbai',
      type:     'Full-time',
      body:     'Shape cultural storytelling across digital platforms, turning craft, process, and product into compelling narratives. You will define Svaroots\' voice across campaigns, content, and community.',
      skills:   ['Brand Strategy', 'Content Direction', 'Digital Marketing', 'Copywriting'],
    },
    'Footwear Designer': {
      team:     'Product',
      location: 'Mumbai',
      type:     'Full-time',
      body:     'Translate textile narratives into modular footwear concepts, balancing material innovation with wearability and construction logic. Work closely with artisan partners and sourcing teams.',
      skills:   ['Footwear Design', 'CAD / Sketching', 'Material Sourcing', 'Construction'],
    },
  };

  function showJobModal(title) {
    const details = jobDetails[title] || {};

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'job-modal-backdrop';
    Object.assign(backdrop.style, {
      position:        'fixed',
      inset:           '0',
      background:      'rgba(30,42,69,0.55)',
      zIndex:          '1000',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      opacity:         '0',
      transition:      'opacity 0.25s ease',
      padding:         '20px',
    });

    // Panel
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      background:    '#fff',
      borderRadius:  '12px',
      maxWidth:      '520px',
      width:         '100%',
      padding:       '40px',
      fontFamily:    "'Nunito Sans', sans-serif",
      color:         '#2a2a2a',
      position:      'relative',
      transform:     'translateY(20px)',
      transition:    'transform 0.28s ease',
      maxHeight:     '90vh',
      overflowY:     'auto',
    });

    const skillsHtml = (details.skills || [])
      .map(s => `<span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #A42100;color:#A42100;font-size:12px;font-weight:600;margin:4px 4px 0 0">${s}</span>`)
      .join('');

    panel.innerHTML = `
      <button id="close-modal" style="position:absolute;top:20px;right:20px;background:none;border:none;cursor:pointer;font-size:22px;color:#888;line-height:1;">✕</button>
      <div style="font-size:11px;font-weight:700;color:#A42100;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px">${details.team || 'Svaroots'}</div>
      <h2 style="font-size:24px;font-weight:800;color:#1e2a45;margin:0 0 12px">${title}</h2>
      <div style="display:flex;gap:16px;font-size:13px;color:#888;margin-bottom:24px">
        <span>📍 ${details.location || 'India'}</span>
        <span>⏱ ${details.type || 'Full-time'}</span>
      </div>
      <p style="font-size:15px;line-height:1.7;color:#444;margin-bottom:24px">${details.body || ''}</p>
      <div style="margin-bottom:28px">${skillsHtml}</div>
      <a href="#"
         style="display:inline-block;padding:14px 32px;background:#A42100;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;transition:background 0.18s"
         onmouseover="this.style.background='#7e1a00'"
         onmouseout="this.style.background='#A42100'">
        Apply Now
      </a>
    `;

    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.style.opacity  = '1';
      panel.style.transform   = 'translateY(0)';
    });

    // Close handlers
    function closeModal() {
      backdrop.style.opacity = '0';
      panel.style.transform  = 'translateY(20px)';
      setTimeout(() => backdrop.remove(), 280);
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    panel.querySelector('#close-modal').addEventListener('click', closeModal);

    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }


  /* ─────────────────────────────────────────
     5. FOOTER EMAIL SUBSCRIBE
  ───────────────────────────────────────── */
  const emailInput   = document.querySelector('.footer-email-row input[type="email"]');
  const subscribeBtn = document.querySelector('.footer-email-row button');

  if (emailInput && subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!re.test(email)) {
        shake(emailInput.closest('.footer-email-row'));
        return;
      }

      subscribeBtn.innerHTML = `<svg width="24" height="24" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
      emailInput.value       = '';
      emailInput.placeholder = 'Thank you! ✓';
      subscribeBtn.disabled  = true;
    });
  }


  /* ─────────────────────────────────────────
     6. JOIN CARDS — hover interaction
  ───────────────────────────────────────── */
  document.querySelectorAll('.join-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform  = 'translateY(-4px)';
      card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      card.style.boxShadow  = '0 8px 24px rgba(164,33,0,0.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });


  /* ─────────────────────────────────────────
     7. SCROLL — fade-in sections on enter
  ───────────────────────────────────────── */
  const fadeTargets = document.querySelectorAll('.stamp-wrap, .join-card, .not-finding');

  fadeTargets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(el => observer.observe(el));


  /* ─────────────────────────────────────────
     UTILS
  ───────────────────────────────────────── */
  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'svr-shake 0.35s ease';
  }

  // Inject shake keyframe
  if (!document.getElementById('svr-shake-style')) {
    const style = document.createElement('style');
    style.id = 'svr-shake-style';
    style.textContent = `
      @keyframes svr-shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-6px); }
        40%      { transform: translateX(6px); }
        60%      { transform: translateX(-4px); }
        80%      { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }

});