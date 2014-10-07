/* global window, Board, console */
'use strict';

var GameCtrl = function ($scope, $interval) {

  // Init Game
  $scope.game = {};
  $scope.game.board = new Board();
  $scope.game.board.init({
    rows: 9,
    cols: 9,
    bombs: 15
  });

  $scope.game.revealed = {};

  window.game = $scope.game;

  var timer;
  function stopTimer() {
    $interval.cancel(timer);
    timer = undefined;
  }

  $scope.game.time = 0;
  timer = $interval(
    function(){
      $scope.game.time++;
      if ($scope.game.time > 999) {
        stopTimer();
      }
    },
    1000
  );
  $scope.$on('$destroy', stopTimer);


  $scope.game.flagsCount = 0;

  this.sayHi = function() {
    return 'hi';
  };

  this.reveal = function (x, y) {
    $scope.game.revealed['_'+x+'_'+y] = true;
    console.log($scope.game.revealed);
  };

  this.isRevealed = function (x, y) {
    return $scope.game.revealed['_'+x+'_'+y] || false;
  };
};

angular.module('speedSweeperApp')

.controller('GameCtrl', GameCtrl)

.directive('smiley', function() {
  return {
    restrict: 'E',
    template: '' +
      '<div' +
      ' class="smiley"' +
      ' ng-class="{caution: clicking && overGrid}"' +
      '>:)</div>'
  };
})

.directive('counter', function() {
  return {
    restrict: 'E',
    scope: {
      count: '='
    },
    controller: function ($scope) {
      $scope.getDigit = function (position) {

        if ($scope.count > 999) {
          return 9;
        }

        var str = $scope.count.toString(10);
        while (str.length < 3) {
          str = '0' + str;
        }
        return str.split('').reverse().join('')[position - 1];
      };
    },
    template: '' +
      '<div class="counter">' +
      '  <span class="digit">{{ getDigit(3) }}</span>' +
      '  <span class="digit">{{ getDigit(2) }}</span>' +
      '  <span class="digit">{{ getDigit(1) }}</span>' +
      '</div>'
  };
})

// .directive('grid', function() {
//   return {
//     restrict: 'E',
//     require: '^game',
//     scope: {
//       ngModel: '='
//     },
//     templateUrl: 'ss.grid',
//     controller: function ($scope) {

//     },
//     link: function (scope, elem, attrs, ctrl) {
//       ctrl.sayHi();
//       console.log(ctrl.sayHi());
//     }
//   };
// })

.directive('foo', function () {
  return {
    restrict: 'E',
    // link: function (scope, element, attrs) {
    //   return {
    //     pre: function (tElem, tAttrs, transcludeFn) {
    //       var tmpl = angular.element('<div>');
    //       tmpl.append('<h2>Hello World</h2>');
    //       tElem.replaceWith(tmpl);
    //     },
    //     post: function (scope, iElem, iAttrs, ctrl) {
    //       console.log(iElem);
    //     }
    //   };
    // }
  };
})

// What about without the row/col messiness?
.directive('grid', function () {
  return {
    restrict: 'E',
    require: '^game',
    scope: {
      ngModel: '='
    },
    // templateUrl: 'ss.grid',
    compile: function (tElem, attrs) {

      // var M = attrs.ngModel.length;
      // var N = M[0].length;

      var rowElem = angular.element('<div>');
      rowElem.addClass('row');

      var cellElem = angular.element('<div>');
      cellElem.addClass('cell');
      cellElem.html('foo');

      for (var i = 0; i < 10; i++) {
        rowElem.append(cellElem.clone());
      }

      tElem.html(rowElem.html());

      // tElem.html(rowElem);
    },
    link: function (scope, elem, attrs, ctrl) {
      ctrl.sayHi();
      console.log(ctrl.sayHi());
    }
  };
})

.directive('cell', function(){
  return {
    restrict: 'E',
    replace: true,
    require: '^game',
    scope: {
      x: '=',
      y: '='
    },
    template: '' +
      '<div' +
      '  class="cell"' +
      '  ng-class="{unknown: !isRevealed}"' +
      '>x</div>',
    link: function (scope, elem, attrs, gameCtrl) {

      scope.isRevealed = false;

      elem.bind('click', function(){
        console.log(scope.x, scope.y);
        scope.$apply(function(){
          gameCtrl.reveal(scope.x, scope.y);
          scope.isRevealed = true;
        });
      });
      // ctrl.sayHi();
      // console.log(ctrl.sayHi());
    }
  };
})

.directive('game', function() {
  return {
    restrict: 'E',
    template: '' +
      '<div class="game">' +
      '  <div class="header">' +
      '    {{ time }} ' +
      '    <counter count="game.time"></counter>' +
      '    <smiley></smiley>' +
      '    <counter count="game.flagsCount"></counter>' +
      '  </div>' +
      '  <grid' +
      '    ng-model="game.board.state"' +
      '    M="game.board.state.length"' +
      '  ></grid>' +
      '</div>',
    controller: 'GameCtrl'
  };
})

.directive('board', function(){
  return {
    restrict: 'E',
    require: '^game',
    scope: {
      foo: '='
    },
    transclude: true,
    template: '' +
      '<div>' +
      '  <pre>asdfasdfas {{ bar }} df</pre>' +
      '  <pre ng-bind="foo | json"></pre>' +
      '  but wait! There\'s more!' +
      '  <div ng-transclude></div>' +
      '</div>',
    // require:
    // scope: {
    //   board: '='
    // },
    controller: function ($scope, $element, $attrs, ctrl) {

      $scope.bar = 'BAR';

      // $scope.foo = {a:1};

      // $scope.setBoard = function setBoardFn (board) {
      //   $scope.board = board;
      // };

      // $scope.board = new Board();
      // window.board = $scope.board;
      // $scope.board.init({
      //   rows: 9,
      //   cols: 9,
      //   bombs: 15
      // });

      // $scope.clicking = false;
      // $scope.overGrid = false;
      // $scope.isCaution = false;

      // $scope.mousedown = function() {
      //   $scope.clicking = true;
      //   console.log('started clicking');
      // };

      // $scope.mouseenter = function () {
      //   $scope.overGrid = true;
      //   console.log('on the grid');
      // };

      // $scope.mouseleave = function() {
      //   $scope.overGrid = false;
      //   console.log('off the grid');
      // };

      // $scope.mouseup = function(e) {
      //   angular.element(e.target).triggerHandler('foo');
      //   $scope.clicking = false;
      //   console.log('stopped clicking');
      // };
    },

    link: function (scope, element, attr, ctrl) {

      scope.board = ctrl.board;

      element
      .bind('dragstart', function (e) {
        console.log('drag started...');
        var img = document.createElement('img');
        img.src='/images/yeoman.png';
        // img.src='/images/blank.png';
        e.dataTransfer.setDragImage(img, 0, 0);
      });

      // .bind('dragleave', function (e) {
      //   console.log('dragleave');
      // });
    }
  };
});

// .directive('revealable', function() {
//   return {
//     restrict: 'A',
//     require: 'cell',
//     // controller: function ($scope, $element, $attrs, )/
//     link: function postLink (scope, iElem, iAttrs, ctrl) {
//       // debugger;
//     }
//   };
// })

// .directive('cell', function() {
//   return {
//     restrict: 'A',
//     // scope: {
//     //   x: '=',
//     //   y: '=',
//     //   val: '=',
//     //   board: '='
//     // },
//     controller: function ($scope) {

//       $scope.isRevealed = function () {
//         return $scope.board.revealed['_' + $scope.x + '_' + $scope.y];
//       };

//       $scope.reveal = function(x, y) {
//         console.log('wtf!!!');
//         window.alert(x,y);
//       };

//       // $scope.reveal = board.reveal(x, y);

//       $scope.isUnknown = false;
//       // console.log($scope.x, $scope.y);
//     },
//     link: function (scope, element) {

//       element

//       .addClass('cell')

//       // .attr('draggable', true)

//       // .on('foo', function() {
//       //   scope.isUnknown = false;
//       //   element.off('foo');
//       // })

//       // .bind('click', function (e) {
//       //   console.log('clicked: ' + scope.x + ',' + scope.y);
//       //   scope.$apply(function(){
//       //     scope.board.reveal(scope.x, scope.y);
//       //   });
//       // })

//       .bind('dragover', function (e) {
//         e.preventDefault();
//       })

//       .bind('dragenter', function (e) {
//         console.log('dragged into cell: ' + scope.x + ',' + scope.y);
//         e.preventDefault();
//       })

//       .bind('drop', function (e) {
//         console.log('Released on cell: ' + scope.x + ',' + scope.y);
//         console.log(e);
//       });
//     }
//   };
// });
