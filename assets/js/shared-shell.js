function ensureGlobalNavbarStyles() {
  if (document.querySelector('link[data-global-navbar-styles]')) {
    return;
  }

  var script = document.currentScript || document.querySelector('script[src*="assets/js/shared-shell.js"]');
  if (!script) {
    return;
  }

  var stylesheetHref = new URL('../css/global-navbar.css', script.src).href;
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = stylesheetHref;
  link.setAttribute('data-global-navbar-styles', 'true');
  document.head.appendChild(link);
}

function normalizeRoot(root) {
  if (!root || root === '.') {
    return '';
  }

  return root.endsWith('/') ? root : root + '/';
}

function buildCaretIcon() {
  return [
    '<svg class="sv-global-nav__caret" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>',
    '</svg>'
  ].join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildInlineFlag(code, label) {
  return [
    '<span class="sv-global-nav__flag-chip" aria-hidden="true" data-flag="' + escapeHtml(code.toLowerCase()) + '"></span>',
    '<span class="sv-global-nav__flag-label">' + escapeHtml(label) + '</span>'
  ].join('');
}

function buildCountryOption(code, label) {
  return [
    '<button class="sv-global-nav__menu-link sv-global-nav__menu-link--flag" type="button" role="menuitem" data-country="' + escapeHtml(code.toLowerCase()) + '">',
      buildInlineFlag(code, label),
    '</button>'
  ].join('');
}

function buildDropdownItem(item, current) {
  var currentAttr = item.key === current ? ' aria-current="page"' : '';
  return '<a class="sv-global-nav__menu-link" href="' + item.href + '" role="menuitem"' + currentAttr + '>' + item.label + '</a>';
}

function buildDropdownGroup(group, current) {
  var isCurrent = group.currentKeys.indexOf(current) !== -1;
  var currentClass = isCurrent ? ' is-current' : '';
  var menuHtml = group.items.map(function (item) {
    return buildDropdownItem(item, current);
  }).join('');
  var topCurrentAttr = isCurrent ? ' aria-current="page"' : '';

  return [
    '<div class="sv-global-nav__item' + currentClass + '" data-dropdown="' + group.key + '">',
    '  <div class="sv-global-nav__top">',
    '    <a class="sv-global-nav__top-link" href="' + group.href + '"' + topCurrentAttr + '>' + group.label + '</a>',
    '    <button class="sv-global-nav__caret-btn" type="button" aria-label="Toggle ' + group.label + ' menu" aria-haspopup="true" aria-expanded="false">',
           buildCaretIcon(),
    '    </button>',
    '  </div>',
    '  <div class="sv-global-nav__menu" role="menu" aria-label="' + group.label + ' submenu">',
         menuHtml,
    '  </div>',
    '</div>'
  ].join('');
}

function buildNavbar(root, current) {
  var normalizedRoot = normalizeRoot(root);
  var groups = [
    {
      key: 'build',
      label: 'Build Your Own',
      href: normalizedRoot + 'pages/build/index.html',
      currentKeys: ['build', 'patch-builder'],
      items: [
        { key: 'build', label: 'Build Your Shoe', href: normalizedRoot + 'pages/build/index.html' },
        { key: 'patch-builder', label: 'Build Your Patch', href: normalizedRoot + 'pages/build/patch.html' }
      ]
    },
    {
      key: 'shop',
      label: 'Shop',
      href: normalizedRoot + 'pages/shop/gifting/plp.html',
      currentKeys: ['gifting', 'shop', 'drops', 'patches', 'base-sneaker', 'post-care'],
      items: [
        { key: 'base-sneaker', label: 'Base Sneaker', href: normalizedRoot + 'pages/shop/base-sneaker/pdp.html' },
        { key: 'patches', label: 'Patches', href: normalizedRoot + 'pages/shop/patches/plp.html' },
        { key: 'drops', label: 'Drops & Exclusives', href: normalizedRoot + 'pages/shop/gifting/plp.html' },
        { key: 'gifting', label: 'Gifts & Bulk Orders', href: normalizedRoot + 'pages/shop/gifting/plp.html' },
        { key: 'post-care', label: 'Post Care Accessories', href: normalizedRoot + 'pages/shop/post-care/pdp.html' }
      ]
    },
    {
      key: 'community',
      label: 'Community',
      href: normalizedRoot + 'pages/community/index.html',
      currentKeys: ['creators', 'community'],
      items: [
        { key: 'community', label: 'Community Feed', href: normalizedRoot + 'pages/community/index.html' },
        { key: 'creators', label: 'Creators', href: normalizedRoot + 'pages/community/index.html' }
      ]
    },
    {
      key: 'roots',
      label: 'Our Roots',
      href: normalizedRoot + 'pages/roots/artisans/index.html',
      currentKeys: ['roots'],
      items: [
        { key: 'roots', label: 'Mission & Vision', href: normalizedRoot + 'pages/roots/artisans/index.html' },
        { key: 'roots', label: 'Collaboration', href: normalizedRoot + 'pages/roots/artisans/index.html' },
        { key: 'roots', label: 'Meet Our Artisans', href: normalizedRoot + 'pages/roots/artisans/index.html' }
      ]
    }
  ];

  var groupsHtml = groups.map(function (group) {
    return buildDropdownGroup(group, current);
  }).join('');

  return [
    '<header class="sv-global-nav" role="banner">',
    '  <div class="sv-global-nav__left">',
    '    <a class="sv-global-nav__brand" href="' + normalizedRoot + 'index.html" aria-label="Svaroots home">',
    '      <img class="sv-global-nav__brand-logo" src="' + normalizedRoot + 'pages/build/sneaker-customizer/assets/svarootslogo.png" alt="" aria-hidden="true" />',
    '    </a>',
    '    <label class="sv-global-nav__search" aria-label="Search">',
    '      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '        <circle cx="11" cy="11" r="7.5" stroke="currentColor" stroke-width="2"></circle>',
    '        <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>',
    '      </svg>',
    '      <input type="text" placeholder="Search" />',
    '    </label>',
    '  </div>',
    '  <div class="sv-global-nav__right">',
    '    <nav class="sv-global-nav__links" aria-label="Global navigation">',
         groupsHtml,
    '    </nav>',
        '    <div class="sv-global-nav__lang" data-dropdown="language">',
        '      <button class="sv-global-nav__caret-btn sv-global-nav__caret-btn--lang" type="button" aria-label="Toggle country menu" aria-haspopup="true" aria-expanded="false">',
      '        <span class="sv-global-nav__flag" aria-hidden="true" data-flag="in"></span>',
           buildCaretIcon(),
    '      </button>',
    '      <div class="sv-global-nav__menu sv-global-nav__menu--lang" role="menu" aria-label="Country submenu">',
             buildCountryOption('in', 'India'),
             buildCountryOption('us', 'United States'),
             buildCountryOption('gb', 'United Kingdom'),
             buildCountryOption('eu', 'Europe'),
    '      </div>',
    '    </div>',
    '    <a class="sv-global-nav__icon-btn" href="' + normalizedRoot + 'pages/shop/gifting/cart-summary.html" aria-label="Cart">',
    '      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '        <path d="M7.5 8V6.5C7.5 4.01 9.51 2 12 2C14.49 2 16.5 4.01 16.5 6.5V8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
    '        <rect x="3" y="8" width="18" height="13" rx="3" stroke="currentColor" stroke-width="1.8"></rect>',
    '      </svg>',
    '    </a>',
    '    <a class="sv-global-nav__icon-btn" href="' + normalizedRoot + 'swaroot%20career%20-%20java/career%20form.html" aria-label="Profile">',
    '      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '        <circle cx="12" cy="7" r="3.5" stroke="currentColor" stroke-width="1.8"></circle>',
    '        <path d="M4 20C4.7 16.7 7.7 14.5 12 14.5C16.3 14.5 19.3 16.7 20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
    '      </svg>',
    '    </a>',
    '  </div>',
    '</header>'
  ].join('');
}

function hideLegacyNavbars() {
  var legacySelectors = [
    'header.navbar',
    '.navbar',
    'header[role="banner"] .navbar'
  ];

  legacySelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (node.closest('.sv-global-nav')) {
        return;
      }
      node.style.display = 'none';
    });
  });
}

function injectGlobalNavbar() {
  var slot = document.querySelector('[data-global-nav-slot]');
  if (!slot) {
    return;
  }

  var root = slot.getAttribute('data-nav-root') || '';
  var current = slot.getAttribute('data-nav-current') || '';
  slot.outerHTML = buildNavbar(root, current);
  hideLegacyNavbars();
}

function initGlobalNavbarDropdowns() {
  var dropdowns = document.querySelectorAll('.sv-global-nav [data-dropdown]');
  if (!dropdowns.length) {
    return;
  }

  function closeAll(exceptNode) {
    dropdowns.forEach(function (dropdown) {
      if (exceptNode && dropdown === exceptNode) {
        return;
      }
      dropdown.classList.remove('is-open');
      var trigger = dropdown.querySelector('.sv-global-nav__caret-btn');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdowns.forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.sv-global-nav__caret-btn');
    if (!trigger) {
      return;
    }

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      var shouldOpen = !dropdown.classList.contains('is-open');
      closeAll(dropdown);
      if (shouldOpen) {
        dropdown.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    dropdown.addEventListener('mouseenter', function () {
      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    dropdown.addEventListener('mouseleave', function () {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (event) {
    var nav = document.querySelector('.sv-global-nav');
    if (!nav || nav.contains(event.target)) {
      return;
    }
    closeAll(null);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAll(null);
    }
  });
}

function initNestedSubmenus() {
  return;
}

function initCountrySelection() {
  var countryMenu = document.querySelector('.sv-global-nav__menu--lang');
  var activeFlag = document.querySelector('.sv-global-nav__flag[data-flag]');
  if (!countryMenu || !activeFlag) {
    return;
  }

  countryMenu.querySelectorAll('.sv-global-nav__menu-link--flag[data-country]').forEach(function (option) {
    option.addEventListener('click', function (event) {
      event.preventDefault();
      var country = option.getAttribute('data-country');
      if (!country) {
        return;
      }

      activeFlag.setAttribute('data-flag', country);
    });
  });
}

function markMatchingLinks() {
  var currentPath = window.location.pathname.replace(/index\.html$/, '');
  var links = document.querySelectorAll('a[href]');

  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.startsWith('http') || link.hasAttribute('aria-current')) {
      return;
    }

    var normalizedHref = new URL(href, window.location.href).pathname.replace(/index\.html$/, '');
    if (normalizedHref === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  ensureGlobalNavbarStyles();
  injectGlobalNavbar();
  initGlobalNavbarDropdowns();
  initNestedSubmenus();
  initCountrySelection();
  markMatchingLinks();
});
