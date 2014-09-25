/* global _, Board */
'use strict';

ddescribe('Board()', function () {

  // xit('should work', function () {

  //   var makeBoard = function(m, n){
  //     n = n || m;
  //     var board = new Array(m);
  //     for (var i = 0; i < m; i++) {
  //       board[i] = new Int8Array(n);
  //     }
  //     return board;
  //   };

  //   var getRandomInt = function getRandomIntFn(min, max) {

  //     return Math.floor(Math.random() * (max - min + 1)) + min;
  //   };

  //   var getNeighbors = function (i, j, board) {

  //     var neighbors = [];

  //     // Board dimensions
  //     var M = board.length;
  //     var N = board[0].length;

  //     var ii,  // test cell row
  //         jj,  // test cell col
  //         di,  // diff row posn
  //         dj;  // diff col posn


  //     // Walk the 3x3 grid with i,j at center
  //     for (di = -1; di <= 1; di++) {
  //       for (dj = -1; dj <= 1; dj++) {

  //         // Set test cell
  //         ii = i + di;
  //         jj = j + dj;

  //         // Skip if i,j
  //         if (ii === i && jj === j) {
  //           continue;
  //         }

  //         // Append if test cell is on board
  //         if ( 0 <= ii && ii < M && 0 <= jj && jj < N ) {
  //           neighbors.push(board[ii][jj]);
  //         }
  //       }
  //     }

  //     return neighbors;
  //   };

  //   // Create Grid
  //   var m = 16,
  //       n = 16,
  //       board = makeBoard(m, n);


  //   var placeBombs = function placeBombsFn(bombs, board) {

  //     var x,
  //         y,
  //         count = 0;

  //     bombs = bombs || 40;

  //     while (count < bombs) {
  //       x = getRandomInt(0, m - 1);
  //       y = getRandomInt(0, n - 1);
  //       if (board[x][y]) {
  //         continue;
  //       } else {
  //         board[x][y] = -1;
  //         count++;
  //       }
  //     }

  //     return board;
  //   };

  //   board = placeBombs(40, board);

  //   var isBomb = function isBombFn(value) {
  //     return 0 > value;
  //   };

  //   var i, j;
  //   // Walk Grid to assign missing
  //   for ( i = 0; i < board.length; i++ ) {
  //     for ( j = 0; j < board[i].length; j++ ) {

  //       // Skip
  //       if (!isBomb(board[i][j])) {
  //         continue;
  //       }

  //       // Assign touch count
  //       board[i][j] = _.filter(
  //         getNeighbors(i, j, board),
  //         isBomb
  //       ).length;
  //     }
  //   }

  //   expect(true).toBe(true);
  // });

  it('should pass', function () {
    expect(true).toBe(true);
  });

  describe('Board', function () {
    it('should exist', function () {
      expect(Board).toEqual(jasmine.any(Function));
    });

    it('should create a Board object', function () {
      var myBoard;
      expect(function(){
        myBoard = new Board();
      }).not.toThrow();
    });

    describe('init()', function () {

      var myBoard;

      beforeEach(function() {
        myBoard = new Board();
      });

      it('should be a public method', function () {
        expect(myBoard.init).toEqual(jasmine.any(Function));
      });

      iit('should initialize the board object', function () {

        var cfg = {
          rows: 5,
          cols: 8,
          bombs: 5
        };

        myBoard.init(cfg);

        var count = 0;
        for (var i = 0; i < cfg.rows; i++) {
          for (var j = 0; j < cfg.cols; j++) {
            if (-1 === myBoard.state[i][j]) {
              count++;
            }
          }
        }

        // Rows
        expect(myBoard.state.length).toBe(cfg.rows);

        // Cols
        _.each(myBoard.state, function (row) {
          expect(row.length).toBe(cfg.cols);
        });

        expect(count).toBe(cfg.bombs);

        console.log(myBoard.peek());
      });
    });
  });
});
