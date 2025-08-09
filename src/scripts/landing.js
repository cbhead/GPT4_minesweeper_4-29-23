fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    const container = document.getElementById('projects');
    const controls = document.getElementById('visibility-controls');

    const stored = JSON.parse(localStorage.getItem('projectLayout') || '{}');
    const order = stored.order || projects.map(p => p.title);
    const visibility = stored.visibility || {};

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
      tile.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
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
      controls.appendChild(label);
    });

    function saveLayout() {
      const newOrder = [...container.querySelectorAll('.project-tile')].map(tile => tile.dataset.title);
      localStorage.setItem('projectLayout', JSON.stringify({ order: newOrder, visibility }));
    }
  })
  .catch(err => console.error('Error loading projects:', err));
