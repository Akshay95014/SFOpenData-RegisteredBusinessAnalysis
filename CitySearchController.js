(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var CitySearchController = function($scope, opendata) {


      var onGotData = function(data) {
          $scope.queryData = data;
      };

      var onError = function() {
          $scope.error = "Couldn't fetch the data";
      }

      var getBusinessesByCity = function(city) {
          opendata.getLocationCityData(city).then(onGotData, onError);
      };

      $scope.getBusinessesByCity = getBusinessesByCity;

    };



    app.controller("CitySearchController", CitySearchController);

}());
