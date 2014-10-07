/* global Utils, Game, Board, Cell */

describe('everything', function () {

  'use strict';

  describe('Utils', function () {
    it('should exist', function () {
      expect(Utils).toBeDefined();
    });

    describe('randInt()', function () {
      it('should be a static method', function () {
        expect(Utils.randInt).toEqual(jasmine.any(Function));
      });

      it('should throw when given bad input', function () {
        expect(function(){
          Utils.randInt(1);
        }).toThrow();
        expect(function(){
          Utils.randInt(1, '2');
        }).toThrow();
      });

      it('should return an integer between min and max', function () {
        var min = 0, max = 1, rand;
        expect(function(){
          rand = Utils.randInt(min, max);
        }).not.toThrow();
        expect(min <= rand).toBe(true);
        expect(rand <= max).toBe(true);
      });
    });
  });

  describe('Game', function () {
    it('should exist', function () {
      expect(Game).toEqual(jasmine.any(Function));
    });
  });

  describe('Board', function () {

    it('should exist', function () {
      expect(Board).toEqual(jasmine.any(Function));
    });

    it('should construct a board', function () {
      var myBoard;
      expect(function(){
        myBoard = new Board(7, 6, 5);
      }).not.toThrow();
    });

    describe('static methods', function () {

      describe('makeGrid()', function () {

        var cfg;
        beforeEach(function(){
          cfg = {
            rows: 7,
            cols: 6,
            bombs: 5
          };
        });

        it('should exist', function () {
          expect(Board.makeGrid).toEqual(jasmine.any(Function));
        });

        describe('grid', function () {
          var grid;
          beforeEach(function(){
            grid = Board.makeGrid(
              cfg.rows,
              cfg.cols,
              cfg.bombs
            );
          });
          it('shoud be a 2D array', function () {
            expect(Array.isArray(grid)).toBe(true);
            expect(grid.every(function(col){
              return Array.isArray(col);
            })).toBe(true);
          });
          describe('dimensions', function () {
            it('should have cfg.rows number of rows', function () {
              expect(grid.length).toEqual(cfg.rows);
            });
            it('should have cfg.cols number of cols', function () {
              expect(grid.every(function(col) {
                return col.length === cfg.cols;
              })).toBe(true);
            });
          });
          describe('bombs', function () {
            it('should have cfg.bombs number of bombs', function () {
              expect(
                grid.reduce(function (accumulator, row) {
                  return accumulator.concat(row);
                }, [])
                .filter(function (val) {
                  return val === -1;
                })
                .length
              ).toEqual(cfg.bombs);
            });
          });
        });
      });

      describe('getNeighbors()', function () {

        var myBoard;

        beforeEach(function(){
          myBoard = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ];
        });

        it('should exist', function () {
          expect(Board.getNeighbors).toEqual(jasmine.any(Function));
        });

        it('should return hash with 3 keys when a corner is requested', function () {
          expect(Object.keys(Board.getNeighbors(0, 0, myBoard)).length).toBe(3);
        });

        it('should return 5 when a side is requested', function () {
          expect(Object.keys(Board.getNeighbors(0, 1, myBoard)).length).toBe(5);
        });

        it('should return 8 when a middle cell is requested', function () {
          expect(Object.keys(Board.getNeighbors(1, 1, myBoard)).length).toBe(8);
        });
      });
    });

    describe('instance creation', function () {

      var myBoard;
      var config = {
        rows: 5,
        cols: 6,
        bombs: 20
      };

      beforeEach(function(){
        spyOn(Board, 'makeGrid').andReturn('vals');
        spyOn(Board, 'makeStates').andReturn('states');
      });

      beforeEach(function(){
        myBoard = new Board(
          config.rows,
          config.cols,
          config.bombs
        );
      });

      it('should construct an instance', function () {
        expect(!!myBoard).toBe(true);
      });

      it('should invoke Board.makeGrid', function () {
        expect(Board.makeGrid).toHaveBeenCalled();
        expect(myBoard.vals).toEqual('vals');
      });

      it('should invoke Board.makeStates', function () {
        expect(Board.makeStates).toHaveBeenCalled();
        expect(myBoard.states).toEqual('states');
      });

      describe('instance member properties', function () {
        it('should have a #vals', function () {
          expect(!!myBoard.vals).toBe(true);
        });
        it('should havea #states', function () {
          expect(!!myBoard.states).toBe(true);
        });
      });
    });

    describe('instance methods', function () {

      var myBoard;

      var config = {
        rows: 3,
        cols: 3,
        bombs: 0
      };

      beforeEach(function(){
        myBoard = new Board(
          config.rows,
          config.cols,
          config.bombs
        );
      });

      describe('reveal()', function () {

        it('should be an instance method', function () {
          expect(myBoard.reveal).toEqual(jasmine.any(Function));
        });

        it('should accept ONLY two integers as args', function () {
          expect(function(){
            myBoard.reveal(1,1);

          }).not.toThrow();
          expect(function(){
            myBoard.reveal('1', 1);
          }).toThrow();
          expect(function(){
            myBoard.reveal(1);
          }).toThrow();
        });

        it('should reveal a single cell if val is number > 1', function () {
          myBoard.vals = [
            [ 1, 1 ],
            [ 1, 1 ]
          ];
          myBoard.states = [
            [ 0, 0 ],
            [ 0, 0 ]
          ];

          myBoard.reveal(0,0);

          expect(myBoard.states[0][0]).toBe(1);
          expect(myBoard.states[0][1]).not.toBe(1);
        });

        it('should reveal neighboring blank cells', function () {
          myBoard.vals = [
            [ 0,  0,  0 ],
            [ 0,  1,  1 ],
            [ 0,  1, -1 ],
          ];
          myBoard.states = [
            [ 0, 0, 0],
            [ 0, 0, 0],
            [ 0, 0, 0]
          ];

          myBoard.reveal(0,0);

          expect(myBoard.states).toEqual([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 0]
          ]);

          myBoard.vals = [
            [ 0, 0, 2, -1],
            [ 0, 0, 3, -1],
            [ 0, 0, 3, -1],
            [ 0, 0, 2, -1]
          ];

          myBoard.states = [
            [ 0, 0, 0, 0],
            [ 0, 0, 0, 0],
            [ 0, 0, 0, 0],
            [ 0, 0, 0, 0]
          ];

          myBoard.reveal(3,0);

          expect(myBoard.states).toEqual(
            [
              [ 1, 1, 1, 0],
              [ 1, 1, 1, 0],
              [ 1, 1, 1, 0],
              [ 1, 1, 1, 0]
            ]
          );

        });
      });

    });

  });

  // xdescribe('Cell', function () {
  //   it('should exist', function () {
  //     expect(Cell).toEqual(jasmine.any(Function));
  //   });
  //   it('should construct an instance', function () {
  //     var myCell;
  //     expect(function(){
  //       myCell = new Cell(1, 2, 3, false);
  //     }).not.toThrow();
  //   });
  // });

});

