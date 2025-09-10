const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');
const profileSection = document.getElementById('profile-section');
const profilePic = document.getElementById('profile-picture');
const profileNameEl = document.getElementById('profile-name');
const profileDetailsEl = document.getElementById('profile-details');

let profile = {};
try {
  profile = JSON.parse(localStorage.getItem('profile') || '{}');
} catch (e) {
  console.warn('Could not access localStorage:', e);
}

if (profile.picture) profilePic.src = profile.picture;
if (profile.name) profileNameEl.textContent = profile.name;
if (profile.details) profileDetailsEl.textContent = profile.details;

function updateProfileSection() {
  profileSection.style.display = (profile.name || profile.details || profile.picture) ? 'flex' : 'none';
  profilePic.style.display = profile.picture ? '' : 'none';
}
updateProfileSection();

function saveProfile() {
  try {
    localStorage.setItem('profile', JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not save profile to localStorage:', e);
  }
}

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

  function addProfileControls() {
    const nameRow = document.createElement('div');
    nameRow.className = 'settings-row';
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = profile.name || '';
    nameInput.addEventListener('input', () => {
      profile.name = nameInput.value;
      profileNameEl.textContent = profile.name;
      saveProfile();
      updateProfileSection();
    });
    nameLabel.appendChild(nameInput);
    nameRow.appendChild(nameLabel);
    controls.appendChild(nameRow);

    const detailsRow = document.createElement('div');
    detailsRow.className = 'settings-row';
    const detailsLabel = document.createElement('label');
    detailsLabel.textContent = 'Details';
    const detailsInput = document.createElement('textarea');
    detailsInput.value = profile.details || '';
    detailsInput.addEventListener('input', () => {
      profile.details = detailsInput.value;
      profileDetailsEl.textContent = profile.details;
      saveProfile();
      updateProfileSection();
    });
    detailsLabel.appendChild(detailsInput);
    detailsRow.appendChild(detailsLabel);
    controls.appendChild(detailsRow);

    const picRow = document.createElement('div');
    picRow.className = 'settings-row';
    const picLabel = document.createElement('label');
    picLabel.textContent = 'Picture';
    const picInput = document.createElement('input');
    picInput.type = 'file';
    picInput.accept = 'image/*';
    picInput.addEventListener('change', () => {
      const file = picInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          profile.picture = e.target.result;
          profilePic.src = profile.picture;
          saveProfile();
          updateProfileSection();
        };
        reader.readAsDataURL(file);
      }
    });
    picLabel.appendChild(picInput);
    picRow.appendChild(picLabel);
    controls.appendChild(picRow);
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

  addThemeSelector();
  addProfileControls();

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
