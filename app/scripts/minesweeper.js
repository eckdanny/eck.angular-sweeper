/* global _ */
'use strict';

function Utils () {
  // nothing here
}

Utils.prototype = Object.create(null);
Utils.prototype.constructor = Utils;

Utils.randInt = function randIntFn (min, max) {
  if ( 'number' !== typeof min ||
       'number' !== typeof max
  ) {
    throw new TypeError('must be numbers');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};


function Cell (x, y, val, isRevealed) {
  this.x = x;
  this.y = y;
  this.val = val;
  this.isRevealed = isRevealed || false;
}

Cell.prototype = Object.create(null);
Cell.prototype.constructor = Cell;

Cell.prototype.isBomb = function () {
  return this.val === -1;
};


function Game () {
  // this.board = Board.create(rows, cols, bombs);
}

Game.prototype = Object.create(null);
Game.prototype.constructor = Game;

Game.prototype.start = function() {
  // body...
};

Game.prototype.end = function() {
  // body...
};

Game.prototype.reset = function() {
  // body...
};

/**
 * Board
 * States
 *   - 0 => hidden
 *   - 1 => revealed
 *   - 2 => marked bomb
 *   - 3 => marked ?
 *   - 4 => danger
 * @constructor
 */
function Board (rows, cols, bombs) {
  this.vals = Board.makeGrid(rows, cols, bombs);
  this.states = Board.makeStates(rows, cols);
}

//
// Statics
//

/**
 * Returns a hash of neighboring values
 * @static
 * @param  {number} i     x grid coordinate
 * @param  {number} j     y grid coordinate
 * @param  {Array[]} board 2D array of values
 * @return {Object}
 * @example
 Board.getNeighbors(
   1,
   1,
   [ [0, 1, -1],
     [0, 1, 1 ],
     [0, 0, 0] ]
  )
  // => {
  //   '0,0': 0,
  //   '0,1': 1,
  //   '0,2': -1,
  //   '1,0': 0,
  //   '1,2': 1,
  //   '2,0': 0,
  //   '2,1': 0,
  //   '2,2': 0,
  // }
  //
  //
 */
Board.getNeighbors = function getNeighborsFn (i, j, board) {

  var neighbors = {};

  // Board dimensions
  var M = board.length;
  var N = board[0].length;

  var ii,  // test cell row
      jj,  // test cell col
      di,  // diff row posn
      dj;  // diff col posn


  // Walk the 3x3 grid with i,j at center
  for (di = -1; di <= 1; di++) {
    for (dj = -1; dj <= 1; dj++) {

      // Set test cell
      ii = i + di;
      jj = j + dj;

      // Skip if i,j
      if (ii === i && jj === j) {
        continue;
      }

      // Append if test cell is on board
      if ( 0 <= ii && ii < M && 0 <= jj && jj < N ) {
        neighbors[ [ii, jj].join(',') ] = board[ii][jj];
      }
    }
  }

  return neighbors;
};

/**
 * Creates dense grid
 * The grid is the minefield. "Cells" can be completely described by an integer
 * value bounded (inclusive) from -1 to 8 that uses the following defs:
 *   * -1         : bomb
 *   *  0         : void
 *   * 8 >= n > 0 : neighbors n bombs
 * In the local closure context, the terms "board" and "grid" are equivalent.
 * @param  {number} rows  number of rows
 * @param  {number} cols  number of columns
 * @param  {number} bombs number of bombs
 * @throws {Error} If bombs > rows * cols
 * @return {Array[]} 2D array of signed ints
 */
Board.makeGrid = function makeGridFn (rows, cols, bombs) {

  var self = this;

  /**
   * initializes an empty 2D array (a board)
   * @param  {number} m rows
   * @param  {n} n cols
   * @return {Array[undefined[]]} 2D array of uninitialized elements
   */
  var emptyBoard = function emptyBoardFn (m, n) {
    var empty = new Array(m);
    n = n || m;
    for (var i = 0; i < m; i++) {
      empty[i] = new Array(n);
    }
    return empty;
  };

  /**
   * Add bombs to a board
   * @param {Array[undefined[]]} board Empty 2D array
   * @param {number} bombs Number of bombs to add
   * @return {Array[number[]]} Sparse 2D array
   */
  var addBombs = function addBombsFn (board, bombs) {

    var x  // row of placed bomb
      , y  // col of placed bomb
      , count = 0   // bombs placed
      , M = board.length      // No. rows in board
      , N = board[0].length   // No. cols in board
      ;

    if ('undefined' === typeof bombs || bombs > M * N) {
      throw new Error('invalid argument');
    }

    if (0 === bombs) {
      return board;
    }

    while (count < bombs) {
      x = Utils.randInt(0, M - 1);
      y = Utils.randInt(0, N - 1);
      if (-1 === board[x][y]) {
        continue;
      } else {
        board[x][y] = -1;
        count++;
      }
    }

    return board;
  };

  /**
   * Adds the non-bomb elements
   * @param  {Array[number[]]} board Sparse 2D array
   * @return {Array[number[]]}       Dense 2D array of signed ints
   */
  var fill = function fillFn (board) {

    var i, j;

    // Walk Grid to assign missing
    for ( i = 0; i < board.length; i++ ) {
      for ( j = 0; j < board[i].length; j++ ) {

        // Skip
        if (-1 === board[i][j]) {
          continue;
        }

        // Assign touch count
        board[i][j] = _.filter(
          self.getNeighbors(i, j, board),
          function(val){
            return -1 === val;
          }
        ).length;
      }
    }

    return board;
  };

  return fill(addBombs(emptyBoard(rows, cols), bombs));
};

/**
 * Returns an pristine states representation
 * Will be the same size as Board#vals.
 * @param  {number} rows Number of rows
 * @param  {number} cols Number of columns
 * @return {Array[number[]]}      Dense 2D array of zeros
 */
Board.makeStates = function makeStatesFn (rows, cols) {
  var states = new Array(rows);
  for (var i = 0; i < rows; i++) {
    states[i] = Array.apply(
      null,
      new Array(cols)
    ).map(Number.prototype.valueOf, 0);
  }
  return states;
};

//
// Instance
//

Board.prototype.constructor = Board;

/**
 * Reveals one or many grid elements
 * Board#reveal updates the board state by either revealing one (in the case
 * where val|x,y > 0) or many (in the case where val|x,y <= 0). In 2nd case
 * (specifically when a *void* is revealed) neighboring cells are recursively
 * revealed as well until a boundary is encountered.
 * @param  {[type]} x X coordinate
 * @param  {number} y Y coordinate
 * @return {void}
 */
Board.prototype.reveal = function (x, y) {

  var self = this;

  if ('number' !== typeof x || 'number' !== typeof y) {
    throw new TypeError('invalid argument(s)');
  }

  if (!this.vals) {
    throw new Error('not initilized yet!');
  }

  var reveal = function revealFn (x, y) {

    var expanded = {};

    function recursiveReveal (x, y) {

      var neighbors, xy;

      if (!expanded[ [x,y].join(',') ]) {
        expanded[ [x,y].join(',') ] = true;
        neighbors = self.constructor.getNeighbors(x, y, self.vals);
        for (xy in neighbors) {
          if (-1 < neighbors[xy]) {
            recursiveReveal.apply(null, xy.split(',').map(Number));
          }
        }
      }
    }

    recursiveReveal(x, y);

    for (var xy in expanded) {
      xy = xy.split(',').map(Number);
      self.states[ xy[0] ][ xy[1] ] = 1;
    }
  };

  switch (this.vals[x][y]) {
    case -1:
      break;
    case 0:
      reveal(x, y);
      break;
    default:
      this.states[x][y] = 1;
  }
};
