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

  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem('projectLayout') || '{}');
  } catch (e) {
    console.warn('Could not access localStorage:', e);
  }
  const order = stored.order || projects.map(p => p.title);
  const visibility = stored.visibility || {};
  const icons = stored.icons || {};

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
