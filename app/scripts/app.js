'use strict';

/**
 * @ngdoc overview
 * @name speedSweeperApp
 * @description
 * # speedSweeperApp
 *
 * Main module of the application.
 */
angular
  .module('speedSweeperApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
