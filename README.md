# GPT4 Minesweeper

This project contains a simple Minesweeper game with a dark theme. The layout has been restructured so it can evolve into a full resume site.

## Project Structure
- `src/` – site pages and assets
  - `index.html` – landing page populated from `projects.json`
  - `projects/` – individual project pages
    - `minesweeper.html`
  - `projects.json` – configuration for project tiles
  - `scripts/` – JavaScript logic
    - `landing.js`
    - `script.js`
  - `styles/` – CSS styles
    - `landing.css`
    - `styles.css`
- `tests/` – Jest unit tests

## Development
Install dependencies and run tests with:

```bash
npm install
npm test
```
