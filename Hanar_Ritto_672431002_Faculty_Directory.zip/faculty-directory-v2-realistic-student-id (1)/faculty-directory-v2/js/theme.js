// ===============================
// Global Dark / Light Mode
// ===============================
(function () {
  function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');

    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = theme === 'dark'
        ? 'bi bi-sun-fill'
        : 'bi bi-moon-stars-fill';
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);

    const button = document.getElementById('themeToggle');
    if (!button || button.dataset.themeBound === 'true') return;

    button.dataset.themeBound = 'true';
    button.addEventListener('click', () => {
      const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  document.addEventListener('DOMContentLoaded', initTheme);
})();
