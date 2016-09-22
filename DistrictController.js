(function() {

  var app = angular.module("registeredBusinessAnalysis");

  var DistrictController = function($scope, opendata, $routeParams) {

    var onBizByNeighborhood = function(data){
      $scope.neighborhoodBusinesses = data;
    }

    var onBizByIndustry = function(data){
      $scope.industryBusinesses = data;
    }

    var onError = function() {
        $scope.error = "Couldn't fetch the data";
    }

    $scope.district_num = $routeParams.district_num;

    opendata.businessesByNeighborhood($scope.district_num).then(onBizByNeighborhood, onError);
    opendata.businessesByIndustryInDistrict($scope.district_num).then(onBizByIndustry, onError);
    opendata.activeBusinessesByYear("2016").then(function(){
      console.log("done!");
    }, onError);
  };

  app.controller("DistrictController", DistrictController);

}());
