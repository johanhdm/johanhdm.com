var app = angular.module('JohanHdM', []);

app.controller('MainController', ['$scope', function($scope){
  'use strict';

  $scope.menuOpen = false;

  $scope.toggleMenu = function(){
    $scope.menuOpen = !$scope.menuOpen;

  };

  var svg = d3.select(".d3")
    .append("svg");

  var t = textures.lines()
    .thicker();

  svg.call(t);

  svg.append("circle")
    .style("fill", t.url());

  //d3.select(".d3").style("background-color", "black");
}]);
