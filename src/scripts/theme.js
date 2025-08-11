(function() {
  const DEFAULT_THEME = {
    landing: {
      background: '#f4f4f4',
      header: '#333',
      headerText: '#fff'
    },
    projects: {}
  };

  let theme;
  try {
    theme = JSON.parse(localStorage.getItem('themeConfig')) || DEFAULT_THEME;
  } catch (e) {
    theme = DEFAULT_THEME;
  }

  window.themeConfig = theme;

  function applyTheme() {
    const project = document.body.dataset.project || 'landing';
    if (project === 'landing') {
      const t = theme.landing || {};
      const def = DEFAULT_THEME.landing;
      document.documentElement.style.setProperty('--landing-bg', t.background || def.background);
      document.documentElement.style.setProperty('--landing-header-bg', t.header || def.header);
      document.documentElement.style.setProperty('--landing-header-text', t.headerText || def.headerText);
    } else {
      const t = (theme.projects && theme.projects[project]) || {};
      document.documentElement.style.setProperty('--bg-color', t.background || '#222');
      document.documentElement.style.setProperty('--text-color', t.text || '#fff');
      document.documentElement.style.setProperty('--header-bg', t.background || '#333');
      document.documentElement.style.setProperty('--header-text', t.text || '#fff');
      document.documentElement.style.setProperty('--primary-color', t.primary || '#3c8dbc');
      document.documentElement.style.setProperty('--secondary-color', t.secondary || '#f6b26b');
    }
  }

  window.applyTheme = applyTheme;

  window.saveThemeConfig = function() {
    try {
      localStorage.setItem('themeConfig', JSON.stringify(theme));
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
    applyTheme();
  };

  applyTheme();
})();
