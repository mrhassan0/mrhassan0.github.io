'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const navLinks = [...navigation.querySelectorAll('a')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

// Keep navigation accurate without rewriting the URL while scrolling.
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
let scrollQueued = false;
function updateActiveSection() {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const current = atBottom
    ? sections.at(-1)
    : sections.filter(section => section.getBoundingClientRect().top <= 150).at(-1);
  navLinks.forEach(link => {
    if (current && link.getAttribute('href') === `#${current.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateActiveSection);
  }
}, { passive: true });
updateActiveSection();

const filters = document.querySelector('.project-filters');
const projects = [...document.querySelectorAll('.project-card')];
const projectCount = document.querySelector('#project-count');
filters.hidden = false;
filters.addEventListener('click', event => {
  const selected = event.target.closest('[data-filter]');
  if (!selected) return;
  const category = selected.dataset.filter;
  filters.querySelectorAll('button').forEach(button => {
    const active = button === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  projects.forEach(project => {
    const visible = category === 'all' || project.dataset.category.split(' ').includes(category);
    project.hidden = !visible;
    if (visible) count++;
  });
  projectCount.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
});

const citations = {
  dynas: `@misc{hassan2026dynas,
  title = {DYNAS: A Dynamic Network Penetration Testing Framework Using Deep Hierarchical Reinforcement Learning},
  author = {Hassan, M. R. and Islam, M. and Alam, M. A. and Hossain, M. I. and Shatabda, S.},
  year = {2026},
  eprint = {2610.40214},
  archivePrefix = {arXiv},
  doi = {10.48550/arXiv.2610.40214},
  url = {https://doi.org/10.48550/arXiv.2610.40214}
}`,
  bangla: `@misc{hassan2026banglaveilguard,
  title = {BanglaVeilGuard: Cross-Script Safety Benchmarking and Lightweight Guardrails for Bangla Large Language Models},
  author = {Hassan, M. R. and Hossain, M. I.},
  year = {2026},
  eprint = {2608.21880},
  archivePrefix = {arXiv},
  doi = {10.48550/arXiv.2608.21880},
  url = {https://doi.org/10.48550/arXiv.2608.21880}
}`
};
const citationDialog = document.querySelector('#citation-dialog');
const citationText = document.querySelector('#citation-text');
document.querySelectorAll('[data-citation]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    citationText.textContent = citations[button.dataset.citation];
    document.querySelector('#citation-status').textContent = '';
    citationDialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => citationDialog.close());
citationDialog.addEventListener('click', event => {
  const rect = citationDialog.getBoundingClientRect();
  if (event.target === citationDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
    citationDialog.close();
  }
});
let toastTimeout;
function notify(message) {
  const toast = document.querySelector('#toast');
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* Fall back when clipboard access is denied. */ }
  const previousFocus = document.activeElement;
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;';
  (citationDialog.open ? citationDialog : document.body).append(input);
  input.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { /* Manual copy remains available. */ }
  input.remove();
  previousFocus?.focus({ preventScroll: true });
  return copied;
}
document.querySelector('#copy-citation').addEventListener('click', async () => {
  const copied = await copyText(citationText.textContent);
  if (!copied) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citationText);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  document.querySelector('#citation-status').textContent = copied
    ? 'BibTeX citation copied.'
    : 'Citation selected. Use your device’s copy command.';
});
const copyEmail = document.querySelector('.copy-email');
copyEmail.hidden = false;
copyEmail.addEventListener('click', async () => {
  const copied = await copyText('mrhassan.bracu@gmail.com');
  notify(copied ? 'Email address copied.' : 'Email: mrhassan.bracu@gmail.com');
});

// Visual enhancements only: content stays fully visible without them.
const siteHeader = document.querySelector('.site-header');
const updateHeader = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 80}ms`);
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  // Only content below the fold is hidden, so nothing visible flashes on load.
  document.querySelectorAll('.section-label, .section h2, .section-heading p, .news-intro > p, .news-item, .about-copy, .paper, .thesis-details, .project-toolbar, .project-card, .experience-intro > p, .academic-mark, .timeline-entry, .skills-list > div, .contact-grid > div, .references').forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

if (window.matchMedia('(hover: hover)').matches) {
  projects.forEach(card => card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  }));
}
