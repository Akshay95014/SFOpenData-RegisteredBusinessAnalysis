(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata) {

        var onGotData = function(data) {
            $log.debug(data);
            $scope.queryData = data;
        }

        var getBusinessesByCity = function(city) {
            $log.debug("Made it into controller's getBusinessesByCity function.");
            opendata.getLocationCityData(city).then(onGotData, function() {
                $scope.error = "Couldn't fetch the data";
            });
        }

        $scope.getBusinessesByCity = getBusinessesByCity;

    }

    app.controller("MainController", MainController);
}());
