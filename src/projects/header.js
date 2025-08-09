fetch('header.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
  })
  .catch(err => console.error('Error loading header:', err));
