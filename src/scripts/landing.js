fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    const container = document.getElementById('projects');
    projects.forEach(project => {
      const tile = document.createElement('a');
      tile.className = 'project-tile';
      tile.href = project.link;
      tile.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h2>${project.title}</h2>
        <p>${project.description}</p>
      `;
      container.appendChild(tile);
    });
  })
  .catch(err => console.error('Error loading projects:', err));
