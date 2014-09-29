/* global _ */
'use strict';

  // game.rebuild();
  // game.stop();
  // game.start();


  // Want to use like this...
  /*
      var myBoard = new Board();
      myBoard.init({
        rows: 16,
        cols: 16,
        bombs: 40
      });
   */


  function Board (data) {
    _.assign(this, data);
  }

  Board.prototype.peek = function () {
    var out = '\n';
    _.each(this.state, function (arr) {
      var key = 0;
      while (!_.isUndefined(arr[key])) {
        out += arr[key] > -1 ?
               arr[key] :
               'B';
        out += ' ';
        key++;
      }
      out += '\n';
    });
    return out;
  };

  Board.prototype.init = function (configObject) {

    var board;

    var makeBoard = function makeBoardFn (m, n){
      n = n || m;
      var board = new Array(m);
      for (var i = 0; i < m; i++) {
        board[i] = new Array(n);
        // board[i] = new Int8Array(n);
      }
      return board;
    };

    var randInt = function randIntFn (min, max) {

      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getNeighbors = function (i, j, board) {

      var neighbors = [];

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
            neighbors.push(board[ii][jj]);
          }
        }
      }

      return neighbors;
    };

    var setBombs = function setBombsFn (board, bombs) {

      var x  // row of placed bomb
        , y  // col of placed bomb
        , count = 0   // bombs placed
        , M = board.length      // No. rows in board
        , N = board[0].length   // No. cols in board
        ;

      if (!bombs || bombs > M * N) {
        throw new Error('invalid argument');
      }

      bombs = bombs || 40;

      while (count < bombs) {
        x = randInt(0, M - 1);
        y = randInt(0, N - 1);
        if (isBomb(board[x][y])) {
          continue;
        } else {
          board[x][y] = -1;
          count++;
        }
      }

      return board;
    };

    var isBomb = function isBombFn (value) {

      return -1 === value;
    };

    var setVoids = function setVoidsFn (board) {

      var i, j;

      // Walk Grid to assign missing
      for ( i = 0; i < board.length; i++ ) {
        for ( j = 0; j < board[i].length; j++ ) {

          // Skip
          if (isBomb(board[i][j])) {
            continue;
          }

          // Assign touch count
          board[i][j] = _.filter(
            getNeighbors(i, j, board),
            isBomb
          ).length;
        }
      }

      return board;
    };

    board = setVoids(
      setBombs(
        makeBoard(
          configObject.rows,
          configObject.cols
        ),
        configObject.bombs
      )
    );

    this.state = board;
    return this;
  };

  // Board.prototype.reveal = function(x, y) {
  //   if ()
  // };


  function Game () {

  }

  Game.prototype.start = function() {
    // body...
  };

  Game.prototype.reset = function() {
    // body...
  };

  Game.prototype.gameover = function() {
    // body...
  };

// })(window, window.angular, window._);
