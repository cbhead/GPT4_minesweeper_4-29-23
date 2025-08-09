document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookmark-form');
  const list = document.getElementById('bookmark-list');

  const loadBookmarks = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    list.innerHTML = '';
    bookmarks.forEach((bm, idx) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = bm.url;
      link.textContent = bm.name;
      link.target = '_blank';
      li.appendChild(link);

      const del = document.createElement('button');
      del.textContent = '\u2715';
      del.addEventListener('click', () => {
        bookmarks.splice(idx, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        loadBookmarks();
      });
      li.appendChild(del);

      list.appendChild(li);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookmark-name').value.trim();
    const url = document.getElementById('bookmark-url').value.trim();
    if (name && url) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      bookmarks.push({ name, url });
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      form.reset();
      loadBookmarks();
    }
  });

  loadBookmarks();
});
