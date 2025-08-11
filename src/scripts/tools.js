function transformText(text, mode) {
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'reverse':
      return text.split('').reverse().join('');
    default:
      return text;
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-text');
    const output = document.getElementById('output-text');
    const select = document.getElementById('transform');
    const run = document.getElementById('run');
    const downloadBtn = document.getElementById('download-storage');
    const uploadInput = document.getElementById('upload-storage');

    run.addEventListener('click', () => {
      const result = transformText(input.value, select.value);
      output.value = result;
    });

    if (downloadBtn && uploadInput) {
      downloadBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(localStorage);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'localStorage.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
            alert('Local storage restored.');
          } catch (err) {
            alert('Invalid local storage file.');
          }
        };
        reader.readAsText(file);
      });
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { transformText };
}
