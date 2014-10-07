/* global window, Board, console */
'use strict';

var GameCtrl = function ($scope, $interval) {

  // Init Game
  $scope.game = {};
  $scope.game.board = new Board(9, 9, 15);
  window.game = $scope.game;

  var timer;
  function stopTimer() {
    $interval.cancel(timer);
    timer = undefined;
  }

  $scope.game.time = 0;

  var startTimer = function () {
    timer = $interval(
      function(){
        $scope.game.time++;
        if ($scope.game.time > 999) {
          stopTimer();
        }
      },
      1000
    );
  };

  $scope.$on('$destroy', stopTimer);

  $scope.game.flagsCount = 0;

  this.reveal = function(x, y) {
    if (!timer) {
      startTimer();
    }
    $scope.game.board.reveal(x,y);
  };

  this.getState = function (x, y) {
    return $scope.game.board.states[x][y];
  };

  this.sayHi = function() {
    return 'hi';
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
      count: '@'
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

// What about without the row/col messiness?
.directive('grid', function () {
  return {
    restrict: 'E',
    require: '^game',
    scope: {
      ngModel: '='
    },
    templateUrl: 'ss.grid',
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
      '  ng-class="getState()"' +
      '>x</div>',
    link: function (scope, elem, attrs, gameCtrl) {

      scope.getState = function() {
        switch (gameCtrl.getState(scope.x, scope.y)) {
          case 0:
            return 'unknown';
          default:
            return 'foo';
        }
      };

      elem.bind('click', function(){
        console.log(scope.x, scope.y);
        scope.$apply(function(){
          gameCtrl.reveal(scope.x, scope.y);
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
      '    <counter count="{{game.time}}"></counter>' +
      '    <smiley></smiley>' +
      '    <counter count="{{game.flagsCount}}"></counter>' +
      '  </div>' +
      '  <grid' +
      '    ng-model="game.board.states"' +
      '  ></grid>' +
      '</div>',
    replace: true,
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
