/* global window, Board, console */
'use strict';
angular.module('speedSweeperApp')
.controller('GameCtrl', function ($scope) {

  var myBoard = new Board();
  window.board = myBoard;
  myBoard.init({
    rows: 9,
    cols: 9,
    bombs: 20
  });

  // $scope.mousedown = function() {
  //   console.log('handler defined in ctrl');
  // };

  $scope.board = myBoard;

  $scope.shit = myBoard.peek();

  // $scope.handleClick = function(x,y) {
  //   alert('' + x + ', ' + y);
  // };
})

.directive('game', function() {
  return {
    scope: {},
    // controller: function ($scope) {


    // }
  };
})

.directive('board', function(){
  return {
    // scope: {
    //   board: '='
    // },
    controller: function ($scope) {

      $scope.clicking = false;
      $scope.overGrid = false;

      $scope.isCaution = false;

      // this.board = $scope.board;

      $scope.mousedown = function() {
        $scope.clicking = true;
        console.log('started clicking');
      };

      $scope.mouseenter = function () {
        $scope.overGrid = true;
        console.log('on the grid');
      };

      $scope.mouseleave = function() {
        $scope.overGrid = false;
        console.log('off the grid');
      };

      $scope.mouseup = function(e) {
        // console.log(e);
        angular.element(e.target).triggerHandler('foo');
        $scope.clicking = false;
        console.log('stopped clicking');
      };

      $scope.sayHi = function() {
        console.log('hi');
      };

    },
    // link: function (scope, element, attr) {
    //   element.on('mousedown', function (event) {
    //     scope.isCaution = true;
    //     scope.$apply();
    //     console.log(scope.isCaution);
    //     console.log('moused down on the board!');
    //   });
    // }
  };
})

.directive('cell', function() {
  return {
    restrict: 'A',
    require: '^board',
    // scope: {
    //   x: '@',
    //   y: '@'
    // },
    controller: function ($scope) {

      $scope.isUnknown = true;

      console.log($scope.x, $scope.$index);

      // $scope.handleMouseUp = function (x, y) {
      //   console.log('x,y : ' + x + ',' + y);
      //   $scope.isUnknown = false;
      // };
    },

    link: function (scope, element) {


      element

      .addClass('cell')

      .attr('draggable', true)

      .on('foo', function() {
        scope.isUnknown = false;
        element.off('foo');
      })

      .bind('click', function (e) {
        console.log('clicked: ' + scope.x + ',' + scope.$index)
      })

      .bind('dragover', function (e) {
        e.preventDefault();
      })

      .bind('dragenter', function (e) {
        console.log('dragged over cell: ' + scope.x + ',' + scope.$index);
        e.preventDefault();
      })

      .bind('drop', function (e) {
        console.log('Released on cell: ' + scope.x + ',' + scope.$index);
        console.log(e);
      });
    }

    // link: function (scope, element, attrs, ctrl) {
    //   element.addClass('cell');
    //   element.addClass('unknown');
    //   element.on('mouseup', function(){
    //     element.removeClass('unknown');
    //     console.log(ctrl.board.peek());
    //     scope.handleMouseUp();
    //   });
    // }
  };
});
