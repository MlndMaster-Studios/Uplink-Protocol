// Lightweight interactions for the minimal mysterious site.
// No analytics. No nonsense. Just vibes.

document.addEventListener('DOMContentLoaded', () => {
  const dayDisplay = document.getElementById('dayClockDisplay');
  const dateLine = document.getElementById('dateLine');
  const flipDayBtn = document.getElementById('flipDayBtn');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const progressBar = document.getElementById('progress-bar');

  // --- Day (letter day) logic ---
  // We'll store a number 1..999 (useful for 'letter day' aesthetic).
  let dayNumber = parseInt(localStorage.getItem('mystery_day') || '1', 10);

  function setDay(n) {
    dayNumber = Math.max(1, Math.floor(n));
    localStorage.setItem('mystery_day', String(dayNumber));
    dayDisplay.textContent = `DAY: ${dayNumber}`;
    dateLine.textContent = `Updated ${new Date().toLocaleString()}`;
  }
  setDay(dayNumber);

  flipDayBtn.addEventListener('click', () => {
    // Flip the day with a little flourish
    setDay(dayNumber + 1);
    flash(dayDisplay);
  });

  // --- Dropdown logic ---
  const dropdownBtn = document.getElementById('dayDropdownBtn');
  const dropdown = document.getElementById('dayDropdown');

  dropdownBtn.addEventListener('click', (e) => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== dropdownBtn) {
      dropdown.style.display = 'none';
    }
  });

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const mode = item.getAttribute('data-mode');
      // playful effect: adjust progress bar and day title
      const pct = mode === '1' ? 24 : mode === '2' ? 56 : 88;
      animateProgressTo(pct);
      dropdown.style.display = 'none';
      dropdownBtn.textContent = `${item.textContent} ▼`;
    });
  });

  // --- Progress bar shuffle ---
  randomizeBtn.addEventListener('click', () => {
    const newPct = Math.floor(Math.random() * 90) + 3;
    animateProgressTo(newPct);
  });

  function animateProgressTo(pct) {
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', pct);
  }

  // --- Tiny bump buttons inside cards (delegation) ---
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="bump"]');
    if (!btn) return;
    // find card
    const card = btn.closest('.schedule-card, .widget-card');
    if (!card) return;
    pulse(card);
    // nudge progress slightly
    const current = parseInt(progressBar.style.width || '0', 10);
    const bump = Math.min(100, current + Math.floor(Math.random() * 7) + 3);
    animateProgressTo(bump);
  });

  // --- Subtle mouse-driven parallax for cards ---
  const cards = Array.from(document.querySelectorAll('.schedule-card, .widget-card'));
  cards.forEach(card => {
    card.addEventListener('mousemove', (ev) => {
      const rect = card.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;  // -1..1
      const y = ((ev.clientY - rect.top) / rect.height) * 2 - 1;
      // set CSS vars used by :hover transform
      card.style.setProperty('--mouseX', (x * 10).toFixed(2));
      card.style.setProperty('--mouseY', (y * 10).toFixed(2));
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouseX', 0);
      card.style.setProperty('--mouseY', 0);
    });
  });

  // --- small helpers ---
  function pulse(el) {
    el.animate([
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(0,0,0,0)' },
      { transform: 'scale(1.02)', boxShadow: '0 12px 28px rgba(0,0,0,0.18)' },
      { transform: 'scale(1)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
    ], { duration: 260, easing: 'ease-out' });
  }

  function flash(el) {
    el.animate([
      { opacity: 1 },
      { opacity: 0.25 },
      { opacity: 1 }
    ], { duration: 260, easing: 'ease-in-out' });
  }

  // Accessibility: keyboard support for bump buttons
  document.querySelectorAll('button[data-action="bump"]').forEach(b => {
    b.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        b.click();
      }
    });
  });

  // Entrance: stagger reveal for rows already handled in CSS.
  // Initialize a small animated nudge for the progress bar to show life.
  setTimeout(() => animateProgressTo(Number(progressBar.style.width.replace('%','')) || 32), 600);
});
