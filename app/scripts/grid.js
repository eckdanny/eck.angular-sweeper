(function (window, _, undefined) { 'use strict';

  function Grid (M, N) {

    if (!M) {
      throw new Error('missing required argument');
    }

    N = N || M;

    this.data = new Int8Array(M * N);
  }

  Grid.prototype = Object.create(null);
  Grid.prototype.constructor = Grid;

  // Grid.

  window.Grid = Grid;

})(window, window._);

(function (window, _, undefined) { 'use strict';

  function Minefield (grid) {
    this.grid = grid;
  }

  Minefield.prototype.init = function() {
    // body...
  };

})(window, window._);
