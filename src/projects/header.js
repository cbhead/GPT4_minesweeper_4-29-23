(function() {
  const base = window.location.pathname.includes('/projects/') ? '../' : '';
  try {
    const req = new XMLHttpRequest();
    req.open('GET', base + 'components/header.html', false);
    req.send(null);
    if (req.status >= 200 && req.status < 300) {
      document.body.insertAdjacentHTML('afterbegin', req.responseText);
      const homeLink = document.querySelector('.home-link');
      if (homeLink) homeLink.href = base + 'index.html';
      if (!document.getElementById('settings-modal')) {
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) settingsBtn.style.display = 'none';
      }
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const next = themeConfig.current === 'dark' ? 'default' : 'dark';
          const preset = PRESET_THEMES[next];
          themeConfig.landing = JSON.parse(JSON.stringify(preset.landing || {}));
          themeConfig.projects = JSON.parse(JSON.stringify(preset.projects || {}));
          themeConfig.current = next;
          saveThemeConfig();
          applyTheme();
        });
      }
    } else {
      console.error('Error loading header:', req.statusText);
    }
  } catch (err) {
    console.error('Error loading header:', err);
  }
})();
