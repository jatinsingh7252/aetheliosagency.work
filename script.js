// ============================================
// Aethelios Agency — Interactions
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile nav toggle ---------- */
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Terminal typewriter ---------- */
const termBody = document.getElementById('termBody');

const termScript = [
  { text: '$ aethelios init project', cls: 'line-bright' },
  { text: '> analyzing requirements...', cls: '' },
  { text: '> stack: web \u00b7 android \u00b7 ios', cls: '' },
  { text: '> design: ui/ux + content', cls: '' },
  { text: '> team: 1 studio, no handoffs', cls: '' },
  { text: '\u2713 ready to ship', cls: 'line-ok' },
];

function renderTerminalInstant() {
  termBody.innerHTML = termScript
    .map(l => `<div class="${l.cls}">${l.text}</div>`)
    .join('');
}

function typeTerminal() {
  let lineIndex = 0;
  let charIndex = 0;
  termBody.innerHTML = '';

  const cursor = document.createElement('span');
  cursor.className = 'term__cursor';

  function typeNextChar() {
    if (lineIndex >= termScript.length) {
      termBody.appendChild(cursor);
      return;
    }

    const currentLine = termScript[lineIndex];
    let lineEl = termBody.children[lineIndex];
    if (!lineEl) {
      lineEl = document.createElement('div');
      lineEl.className = currentLine.cls;
      termBody.appendChild(lineEl);
    }

    if (charIndex <= currentLine.text.length) {
      lineEl.textContent = currentLine.text.slice(0, charIndex);
      charIndex++;
      setTimeout(typeNextChar, 18 + Math.random() * 22);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNextChar, 260);
    }
  }

  typeNextChar();
}

if (termBody) {
  if (prefersReducedMotion) {
    renderTerminalInstant();
  } else {
    // Kick off once the hero is in view
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeTerminal();
          heroObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    heroObserver.observe(termBody);
  }
}

/* ---------- Scroll reveal ---------- */
const revealTargets = document.querySelectorAll(
  '.filecard, .status__item, .section__head, .contact__panel, .hero__meta'
);

revealTargets.forEach(el => el.classList.add('reveal'));

if (prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('in'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ---------- Copy to clipboard ---------- */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      showToast(`copied ${value}`);
    } catch (err) {
      showToast('copy failed — select manually');
    }
  });
});
