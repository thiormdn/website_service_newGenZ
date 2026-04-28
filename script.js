/**
 * NewGenZ Laptop Service — script.js
 * Features: navbar scroll, hamburger menu, smooth scroll, scroll animations,
 *           active nav link highlight, progress bar animation
 */

// ── DOM REFERENCES ──────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const navOverlay  = document.getElementById('nav-overlay');
const navLinkEls  = document.querySelectorAll('.nav-link');
const waFloat     = document.getElementById('waFloat');
const fadeEls     = document.querySelectorAll('.fade-up');

// ── NAVBAR SCROLL EFFECT ─────────────────────────────────────
function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run once on load

// ── HAMBURGER MENU ───────────────────────────────────────────
function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

navOverlay.addEventListener('click', closeMenu);

// Close menu when a nav link is clicked
navLinkEls.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
});

// ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10);
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

// ── ACTIVE NAV LINK ON SCROLL ────────────────────────────────
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
  ) + 20;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ── INTERSECTION OBSERVER — FADE-UP ANIMATIONS ──────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));

// ── PROGRESS BAR ANIMATION (hero laptop card) ────────────────
// Animate progress bars when hero section enters view
const heroPi = document.querySelectorAll('.pi-fill');

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      heroPi.forEach(bar => {
        const finalWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = finalWidth;
        }, 300);
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ── FLOATING WA BUTTON — HIDE ON TOP ────────────────────────
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    waFloat.style.opacity = '1';
    waFloat.style.pointerEvents = 'auto';
  } else {
    waFloat.style.opacity = '0';
    waFloat.style.pointerEvents = 'none';
  }
}, { passive: true });

// Init hidden
waFloat.style.opacity = '0';
waFloat.style.transition = 'opacity .3s ease';
waFloat.style.pointerEvents = 'none';

// ── COUNTER ANIMATION (stats) ────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const start    = performance.now();
  const isFloat  = target % 1 !== 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = isFloat
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(el => {
        const raw = el.textContent.trim();

        // Parse "200+" → 200 + suffix "+"
        // Parse "98%" → 98 + suffix "%"
        // Skip "1–3 Hari"
        const numMatch = raw.match(/^([\d.]+)([+%]?)(.*)$/);
        if (numMatch) {
          const num    = parseFloat(numMatch[1]);
          const suffix = numMatch[2] + numMatch[3];
          animateCounter(el, num, suffix);
        }
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.8 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── SERVICE CARD — SUBTLE TILT ───────────────────────────────
document.querySelectorAll('.service-card, .target-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const tiltX  = (y / rect.height) * 6;
    const tiltY  = -(x / rect.width) * 6;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── NAVBAR LOGO — SCROLL TO TOP ──────────────────────────────
document.querySelector('.nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMenu();
});

// ── YEAR IN FOOTER ───────────────────────────────────────────
const yearEls = document.querySelectorAll('.footer-bottom p');
yearEls.forEach(el => {
  if (el.textContent.includes('©')) {
    el.innerHTML = el.innerHTML.replace('2025', new Date().getFullYear());
  }
});
