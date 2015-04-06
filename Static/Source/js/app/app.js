var app = angular.module('JohanHdM', []);

app.controller('MainController', ['$scope', function($scope){
  'use strict';

  $scope.menuOpen = false;

  $scope.toggleMenu = function(){
    $scope.menuOpen = !$scope.menuOpen;

  };
}]);
