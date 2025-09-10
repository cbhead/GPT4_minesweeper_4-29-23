const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');

// Fallback project list used if projects.json fails to load
const FALLBACK_PROJECTS = [
  {
    title: 'Minesweeper',
    description: 'Classic Minesweeper game built with vanilla JS.',
    link: 'projects/minesweeper.html',
    icon: 'fa-solid fa-bomb'
  },
  {
    title: 'Bookmarks',
    description: 'Collection of useful bookmarks.',
    link: 'projects/bookmarks.html',
    icon: 'fa-solid fa-bookmark'
  },
  {
    title: 'Tools',
    description: 'Handy tools for everyday tasks.',
    link: 'projects/tools.html',
    icon: 'fa-solid fa-wrench'
  }
];

settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

settingsClose.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === settingsModal) settingsModal.style.display = 'none';
});

// Initialize the page with project data
function init(projects) {
  const container = document.getElementById('projects');
  const controls = document.getElementById('settings-controls');

  let themeSelect;
  const landingInputs = {};
  const projectInputs = {};

  function updateThemeUI() {
    const lt = themeConfig.landing || {};
    if (landingInputs.background) landingInputs.background.value = lt.background || '#f4f4f4';
    if (landingInputs.header) landingInputs.header.value = lt.header || '#333';
    if (landingInputs.headerText) landingInputs.headerText.value = lt.headerText || '#fff';

    Object.keys(projectInputs).forEach(title => {
      const inputs = projectInputs[title];
      const t = (themeConfig.projects && themeConfig.projects[title]) || {};
      if (inputs.background) inputs.background.value = t.background || '#ffffff';
      if (inputs.text) inputs.text.value = t.text || '#000000';
      if (inputs.primary) inputs.primary.value = t.primary || '#3c8dbc';
      if (inputs.secondary) inputs.secondary.value = t.secondary || '#f6b26b';
      const tile = container.querySelector(`[data-title="${title}"]`);
      if (tile) {
        tile.style.backgroundColor = t.background || '';
        tile.style.color = t.text || '';
        const icon = tile.querySelector('.project-icon');
        if (icon) icon.style.color = t.primary || '';
        tile.style.borderColor = t.secondary || '';
      }
    });
  }

  function applyPreset(name) {
    const preset = window.PRESET_THEMES[name];
    if (!preset) return;
    themeConfig.landing = JSON.parse(JSON.stringify(preset.landing || {}));
    themeConfig.projects = JSON.parse(JSON.stringify(preset.projects || {}));
    themeConfig.current = name;
    saveThemeConfig();
    updateThemeUI();
    if (themeSelect) themeSelect.value = name;
  }

  function addThemeSelector() {
    const row = document.createElement('div');
    row.className = 'settings-row';
    const label = document.createElement('label');
    label.textContent = 'Theme';
    const select = document.createElement('select');
    Object.keys(window.PRESET_THEMES).forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      if (themeConfig.current === name) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      applyPreset(select.value);
    });
    themeSelect = select;
    label.appendChild(select);
    row.appendChild(label);
    controls.appendChild(row);
  }

  function addColorControl(labelText, value, onChange) {
    const row = document.createElement('div');
    row.className = 'settings-row';
    const label = document.createElement('label');
    label.textContent = labelText;
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value;
    input.addEventListener('input', () => {
      onChange(input.value);
      themeConfig.current = 'custom';
      saveThemeConfig();
    });
    label.appendChild(input);
    row.appendChild(label);
    controls.appendChild(row);
    return input;
  }

  function addThemeActions() {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset to default';
    resetBtn.addEventListener('click', () => applyPreset('default'));
    row.appendChild(resetBtn);

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Theme';
    exportBtn.addEventListener('click', () => {
      const dataStr = JSON.stringify(themeConfig, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'themeConfig.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    row.appendChild(exportBtn);

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json';
    importInput.style.display = 'none';
    importInput.addEventListener('change', () => {
      const file = importInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          themeConfig.landing = data.landing || {};
          themeConfig.projects = data.projects || {};
          themeConfig.current = data.current || 'custom';
          saveThemeConfig();
          updateThemeUI();
          if (window.PRESET_THEMES[themeConfig.current]) {
            themeSelect.value = themeConfig.current;
          } else {
            themeSelect.value = 'default';
          }
        } catch (e) {
          alert('Invalid theme file');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import Theme';
    importBtn.addEventListener('click', () => importInput.click());
    row.appendChild(importBtn);
    row.appendChild(importInput);

    controls.appendChild(row);
  }

  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem('projectLayout') || '{}');
  } catch (e) {
    console.warn('Could not access localStorage:', e);
  }
  const order = stored.order || projects.map(p => p.title);
  const visibility = stored.visibility || {};
  const icons = stored.icons || {};

  addThemeSelector();

  const landingTheme = themeConfig.landing || {};
  landingInputs.background = addColorControl('Landing Background', landingTheme.background || '#f4f4f4', v => {
    themeConfig.landing.background = v;
  });
  landingInputs.header = addColorControl('Header Background', landingTheme.header || '#333', v => {
    themeConfig.landing.header = v;
  });
  landingInputs.headerText = addColorControl('Header Text', landingTheme.headerText || '#fff', v => {
    themeConfig.landing.headerText = v;
  });

  addThemeActions();

  const projectMap = new Map(projects.map(p => [p.title, p]));
  const orderedProjects = [];
  order.forEach(title => {
    if (projectMap.has(title)) {
      orderedProjects.push(projectMap.get(title));
      projectMap.delete(title);
    }
  });
  orderedProjects.push(...projectMap.values());

  orderedProjects.forEach(project => {
    const tile = document.createElement('a');
    tile.className = 'project-tile';
    tile.href = project.link;
    tile.draggable = true;
    tile.dataset.title = project.title;
    const iconClass = icons[project.title] || project.icon;
    tile.innerHTML = `
      <i class="${iconClass} project-icon"></i>
      <h2>${project.title}</h2>
      <p>${project.description}</p>
    `;
    const theme = (themeConfig.projects && themeConfig.projects[project.title]) || {};
    if (theme.background) tile.style.backgroundColor = theme.background;
    if (theme.text) tile.style.color = theme.text;
    const iconElInit = tile.querySelector('.project-icon');
    if (theme.primary) iconElInit.style.color = theme.primary;
    if (theme.secondary) tile.style.borderColor = theme.secondary;
    if (visibility[project.title] === false) {
      tile.style.display = 'none';
    }
    container.appendChild(tile);

    tile.addEventListener('dragstart', () => {
      tile.classList.add('dragging');
    });

    tile.addEventListener('dragend', () => {
      tile.classList.remove('dragging');
      saveLayout();
    });
  });

  container.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = container.querySelector('.dragging');
    const target = e.target.closest('.project-tile');
    if (!dragging || !target || dragging === target) return;
    const tiles = [...container.querySelectorAll('.project-tile')];
    const draggingIndex = tiles.indexOf(dragging);
    const targetIndex = tiles.indexOf(target);
    if (draggingIndex < targetIndex) {
      container.insertBefore(dragging, target.nextSibling);
    } else {
      container.insertBefore(dragging, target);
    }
  });

  orderedProjects.forEach(project => {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = visibility[project.title] !== false;
    checkbox.addEventListener('change', () => {
      const tile = container.querySelector(`[data-title="${project.title}"]`);
      tile.style.display = checkbox.checked ? '' : 'none';
      visibility[project.title] = checkbox.checked;
      saveLayout();
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(project.title));
    row.appendChild(label);

    const iconInput = document.createElement('input');
    iconInput.type = 'text';
    iconInput.value = icons[project.title] || project.icon;
    iconInput.addEventListener('change', () => {
      const iconEl = container.querySelector(`[data-title="${project.title}"] .project-icon`);
      iconEl.className = `${iconInput.value} project-icon`;
      icons[project.title] = iconInput.value;
      saveLayout();
    });
    row.appendChild(iconInput);

    const projectTheme = themeConfig.projects[project.title] || {};
    const inputs = {};
    function themeColorInput(prop, defaultVal, apply) {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = projectTheme[prop] || defaultVal;
      input.title = prop;
      input.addEventListener('input', () => {
        projectTheme[prop] = input.value;
        themeConfig.projects[project.title] = projectTheme;
        const tileEl = container.querySelector(`[data-title="${project.title}"]`);
        apply(tileEl, input.value);
        themeConfig.current = 'custom';
        saveThemeConfig();
      });
      row.appendChild(input);
      return input;
    }

    inputs.background = themeColorInput('background', '#ffffff', (tileEl, val) => {
      tileEl.style.backgroundColor = val;
    });
    inputs.text = themeColorInput('text', '#000000', (tileEl, val) => {
      tileEl.style.color = val;
    });
    inputs.primary = themeColorInput('primary', '#3c8dbc', (tileEl, val) => {
      const icon = tileEl.querySelector('.project-icon');
      icon.style.color = val;
    });
    inputs.secondary = themeColorInput('secondary', '#f6b26b', (tileEl, val) => {
      tileEl.style.borderColor = val;
    });

    projectInputs[project.title] = inputs;
    controls.appendChild(row);
  });

  function saveLayout() {
    const newOrder = [...container.querySelectorAll('.project-tile')].map(tile => tile.dataset.title);
    try {
      localStorage.setItem('projectLayout', JSON.stringify({ order: newOrder, visibility, icons }));
    } catch (e) {
      console.warn('Could not save layout to localStorage:', e);
    }
  }
}

fetch('projects.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(init)
  .catch(err => {
    console.error('Error loading projects:', err);
    init(FALLBACK_PROJECTS);
  });
