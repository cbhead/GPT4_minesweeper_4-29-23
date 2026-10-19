(function() {
  function exportSettings() {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'localStorage.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Could not export settings:', e);
    }
  }

  function importSettings(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
        alert('Local storage restored.');
      } catch (err) {
        alert('Invalid local storage file.');
      }
    };
    reader.readAsText(file);
  }

  window.exportSettings = exportSettings;
  window.importSettings = importSettings;
})();
