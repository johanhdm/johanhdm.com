var app = angular.module('JohanHdM', []);

app.controller('MainController', ['$scope', function($scope){
  'use strict';

  $scope.menuOpen = false;
  $scope.hideFullHeadImage = false;

  $scope.toggleMenu = function(){
    $scope.menuOpen = !$scope.menuOpen;

  };

  console.log(document.width);
  var width = document.width *2;

  var svg = d3.select(".d3")
    .append("svg")
    .attr('width', width)
    .attr('height', 600);


  var t = textures.lines().thicker();

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

app.controller('CampaignController', ['$scope', '$http', function($scope, $http){
  $scope.agency = null;

  var promise = $http.get('http://who-dis.johanhdm.com');

  promise.success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    console.log(data);
    console.log(status);
    if (status == 200){
      $scope.agency = data;
    }


  });


}]);
