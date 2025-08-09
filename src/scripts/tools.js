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

    run.addEventListener('click', () => {
      const result = transformText(input.value, select.value);
      output.value = result;
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { transformText };
}
