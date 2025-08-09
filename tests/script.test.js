const { JSDOM } = require('jsdom');

function setupBoard(size) {
  const dom = new JSDOM(`<!DOCTYPE html><div id="game-board"></div>`);
  global.window = dom.window;
  global.document = dom.window.document;
  document.addEventListener = () => {};

  const board = document.getElementById('game-board');
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = Math.floor(i / size);
    cell.dataset.col = i % size;
    board.appendChild(cell);
  }

  jest.resetModules();
  const { getAdjacentCells, __setBoard } = require('../src/scripts/script.js');
  __setBoard(size, board);
  return { getAdjacentCells, board };
}

describe('getAdjacentCells', () => {
  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  test('returns 3 neighbors for a corner cell', () => {
    const { getAdjacentCells, board } = setupBoard(3);
    const cell = board.children[0];
    expect(getAdjacentCells(cell)).toHaveLength(3);
  });

  test('returns 5 neighbors for an edge cell', () => {
    const { getAdjacentCells, board } = setupBoard(3);
    const cell = board.children[1];
    expect(getAdjacentCells(cell)).toHaveLength(5);
  });

  test('returns 8 neighbors for a middle cell', () => {
    const { getAdjacentCells, board } = setupBoard(3);
    const cell = board.children[4];
    expect(getAdjacentCells(cell)).toHaveLength(8);
  });
});

