// script.js
// Lightweight behaviour for Liam's wishlist site.
// - click an item to open its link in a new tab
// - mark items purchased (persisted in localStorage)
// - filtering by stars, search, and toggling VIP list
// - copy visible links to clipboard

(() => {
  const wishlist = document.getElementById('wishlist');
  const items = Array.from(document.querySelectorAll('.wish'));
  items.forEach(el => {
  if (!el.querySelector('.mark-purchased')) {
    const btn = document.createElement('button');
    btn.className = 'mark-purchased';
    btn.textContent = '✓';
    el.querySelector('.wish-actions').appendChild(btn);
  }
});
  const searchInput = document.getElementById('search');
  const filterStars = document.getElementById('filterStars');
  const toggleVIP = document.getElementById('toggleVIP');
  const vipGroup = document.getElementById('vipGroup');
  const copyLinksBtn = document.getElementById('copyLinks');
  const clearPurchasedBtn = document.getElementById('clearPurchased');

  const STORAGE_KEY = 'liam_wishlist_purchased_v1';

  // Load purchased set from localStorage
  function loadPurchased() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function savePurchased(map) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }

  let purchasedMap = loadPurchased();

  // Apply purchased marks visually
  function refreshPurchasedMarks() {
    items.forEach(el => {
      const id = getItemId(el);
      if (purchasedMap[id]) {
        el.classList.add('purchased');
        el.setAttribute('data-purchased', 'true');
      } else {
        el.classList.remove('purchased');
        el.removeAttribute('data-purchased');
      }
    });
  }

  function getItemId(el) {
    // prefer a stable ID: category + title
    const title = el.querySelector('h3')?.innerText.trim() || 'item';
    const cat = el.dataset.category || 'misc';
    return `${cat}::${title}`;
  }

items.forEach(el => {
  const markBtn = el.querySelector('.mark-purchased');
  if (markBtn) {
    markBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const id = getItemId(el);
      purchasedMap[id] = !purchasedMap[id];
      savePurchased(purchasedMap);
      refreshPurchasedMarks();
    });
  }

  el.addEventListener('click', (ev) => {
    if (ev.target.closest('.mark-purchased')) return;
    const link = el.dataset.link;
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener');
    }
  });
});

    // double-click toggles purchased (convenience)
    el.addEventListener('dblclick', (ev) => {
      const id = getItemId(el);
      purchasedMap[id] = !purchasedMap[id];
      savePurchased(purchasedMap);
      refreshPurchasedMarks();
    });
  });

  // Filtering logic (stars + search)
  function applyFilters() {
    const starFilter = filterStars.value; // "all" or number
    const query = (searchInput.value || '').toLowerCase().trim();

    items.forEach(el => {
      const stars = parseInt(el.dataset.stars || '1', 10);
      const title = el.querySelector('h3')?.innerText.toLowerCase() || '';
      const meta = el.querySelector('.meta')?.innerText.toLowerCase() || '';

      const matchesStars = starFilter === 'all' ? true : (stars === parseInt(starFilter, 10));
      const matchesQuery = !query || title.includes(query) || meta.includes(query);

      el.style.display = (matchesStars && matchesQuery) ? '' : 'none';
    });
  }

  // Copy visible links
  async function copyVisibleLinks() {
    const visible = items.filter(i => i.style.display !== 'none');
    if (!visible.length) {
      alert('No visible items to copy.');
      return;
    }
    const lines = visible.map(el => {
      const title = el.querySelector('h3')?.innerText.trim() || 'Item';
      const link = (el.dataset.link && el.dataset.link !== '#') ? el.dataset.link : '[no link]';
      return `${title} — ${link}`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      copyLinksBtn.textContent = 'Copied!';
      setTimeout(() => copyLinksBtn.textContent = 'Copy visible links', 1300);
    } catch {
      prompt('Copy these links manually:', lines);
    }
  }

  // Toggle VIP
  function toggleVipGroup() {
    const hidden = vipGroup.hasAttribute('hidden');
    if (hidden) {
      vipGroup.removeAttribute('hidden');
      toggleVIP.textContent = 'Hide VIP list';
    } else {
      vipGroup.setAttribute('hidden', '');
      toggleVIP.textContent = 'Show VIP list';
    }
  }

  // Clear purchased marks
  function clearPurchased() {
    purchasedMap = {};
    savePurchased(purchasedMap);
    refreshPurchasedMarks();
  }

  // Wire up UI
  searchInput.addEventListener('input', applyFilters);
  filterStars.addEventListener('change', applyFilters);
  toggleVIP.addEventListener('click', toggleVipGroup);
  copyLinksBtn.addEventListener('click', copyVisibleLinks);
  clearPurchasedBtn.addEventListener('click', () => {
    if (confirm('Clear all purchased marks?')) clearPurchased();
  });

  // small accessibility: keyboard toggles
  document.addEventListener('keydown', (e) => {
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleVipGroup();
    }
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // initial run
  refreshPurchasedMarks();
  applyFilters();

})();
