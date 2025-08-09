# GPT4 Minesweeper

This project now hosts a growing set of client-side tools. Originally a Minesweeper game, it now includes a bookmark manager and a collection of simple text transformation utilities. All data is stored locally in the browser.

## Project Structure
- `src/` – site pages and assets
  - `index.html` – landing page populated from `projects.json`
  - `projects/` – individual project pages
    - `minesweeper.html`
    - `bookmarks.html`
    - `tools.html`
  - `projects.json` – configuration for project tiles
  - `scripts/` – JavaScript logic
    - `landing.js`
    - `script.js` – Minesweeper logic
    - `bookmarks.js` – bookmark manager
    - `tools.js` – text transformation utilities
  - `styles/` – CSS styles
    - `landing.css`
    - `styles.css`
- `tests/` – Jest unit tests
  - `script.test.js`
  - `tools.test.js`

## Development
Install dependencies and run tests with:

```bash
npm install
npm test
```
