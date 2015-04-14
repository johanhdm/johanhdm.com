var app = angular.module('JohanHdM', []);

app.controller('MainController', ['$scope', function($scope){
  'use strict';

  $scope.menuOpen = false;
  $scope.hideFullHeadImage = false;

  $scope.toggleMenu = function(){
    $scope.menuOpen = !$scope.menuOpen;

  };

  console.log(document.width);
  var width = 1280;

  var svg = d3.select(".d3")
    .append("svg")
    .attr('width', width)
    .attr('height', 600);


  var t = textures.circles().lighter();

  svg.call(t);

  svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', 600)
    .style({
      "fill": t.url()
    });
  //d3.select(".d3").style("background-color", "black");
}]);
