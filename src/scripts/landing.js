const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');

// Fallback project list used if projects.json fails to load
const FALLBACK_PROJECTS = [
  {
    title: 'Minesweeper',
    description: 'Classic Minesweeper game built with vanilla JS.',
    link: 'projects/minesweeper.html',
    icon: 'fa-solid fa-bomb',
    category: 'Games'
  },
  {
    title: 'Bookmarks',
    description: 'Collection of useful bookmarks.',
    link: 'projects/bookmarks.html',
    icon: 'fa-solid fa-bookmark',
    category: 'Reference'
  },
  {
    title: 'Tools',
    description: 'Handy tools for everyday tasks.',
    link: 'projects/tools.html',
    icon: 'fa-solid fa-wrench',
    category: 'Utilities'
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
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

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
      const preset = window.PRESET_THEMES[select.value];
      themeConfig.landing = JSON.parse(JSON.stringify(preset.landing || {}));
      themeConfig.projects = JSON.parse(JSON.stringify(preset.projects || {}));
      themeConfig.current = select.value;
      saveThemeConfig();
      location.reload();
    });
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

  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];
  if (categories.length > 1) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  } else {
    categoryFilter.style.display = 'none';
  }

  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const selected = categoryFilter.value;
    container.querySelectorAll('.project-tile').forEach(tile => {
      const title = tile.dataset.title.toLowerCase();
      const desc = (tile.dataset.description || '').toLowerCase();
      const cat = tile.dataset.category || '';
      const matchesQuery = !query || title.includes(query) || desc.includes(query);
      const matchesCat = !selected || cat === selected;
      const visible = visibility[tile.dataset.title] !== false;
      tile.style.display = matchesQuery && matchesCat && visible ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  addThemeSelector();

  const landingTheme = themeConfig.landing || {};
  addColorControl('Landing Background', landingTheme.background || '#f4f4f4', v => {
    themeConfig.landing.background = v;
  });
  addColorControl('Header Background', landingTheme.header || '#333', v => {
    themeConfig.landing.header = v;
  });
  addColorControl('Header Text', landingTheme.headerText || '#fff', v => {
    themeConfig.landing.headerText = v;
  });

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
    tile.dataset.description = project.description;
    if (project.category) tile.dataset.category = project.category;
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
      visibility[project.title] = checkbox.checked;
      applyFilters();
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
    }

    themeColorInput('background', '#ffffff', (tileEl, val) => {
      tileEl.style.backgroundColor = val;
    });
    themeColorInput('text', '#000000', (tileEl, val) => {
      tileEl.style.color = val;
    });
    themeColorInput('primary', '#3c8dbc', (tileEl, val) => {
      const icon = tileEl.querySelector('.project-icon');
      icon.style.color = val;
    });
    themeColorInput('secondary', '#f6b26b', (tileEl, val) => {
      tileEl.style.borderColor = val;
    });

    controls.appendChild(row);
  });

  applyFilters();

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
