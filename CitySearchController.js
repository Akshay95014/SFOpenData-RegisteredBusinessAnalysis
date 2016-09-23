(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var CitySearchController = function($scope, opendata) {


      // Once the data is received, save it in the scope for access by HTMl
      var onGotData = function(data) {
          $scope.queryData = data;
      };

      var onError = function() {
          $scope.error = "Couldn't fetch the data";
      }

      // Called whenever someone enters "Search" on the City-Search page
      var getBusinessesByCity = function(city) {
          opendata.getLocationCityData(city).then(onGotData, onError);
      };

      var getBusinessesByName = function(name) {
          opendata.getBusinessNameData(name).then(onGotData, onError);
      };

      // Make the function available outside the controller
      $scope.getBusinessesByCity = getBusinessesByCity;
      $scope.getBusinessesByName = getBusinessesByName;

    };

    app.controller("CitySearchController", CitySearchController);

}());
