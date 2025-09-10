/**
 * Basic scaffold for a standalone module.
 * Copy this folder and update the contents to create a new module.
 */

export function init() {
  const root = document.getElementById('app');
  if (root) {
    root.textContent = 'Hello from a new module!';
  }
}

// Automatically initialise when the script is loaded
init();
