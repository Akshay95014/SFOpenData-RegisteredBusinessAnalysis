(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata) {

        var onGotData = function(data) {
            $log.debug(data);
            $scope.queryData = data;
        }

        var onError = function() {
            $scope.error = "Couldn't fetch the data";
        }

        var getBusinessesByCity = function(city) {
            $log.debug("Made it into controller's getBusinessesByCity function.");
            opendata.getLocationCityData(city).then(onGotData, onError);
        }

        var onBizByDistrict = function(data) {
            $scope.businessByDistrict = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByDistrict, function(business) {
                business.supervisor_district = parseFloat(business.supervisor_district);
                business.count = parseFloat(business.count);
            });
        }

        var onBizByIndustry = function(data) {
            $scope.businessByIndustry = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByIndustry, function(business) {
                business.count = parseFloat(business.count);
            });
        }

        var onBizByYear = function(data) {
            $scope.businessByYear = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByYear, function(business) {
                business.count = parseFloat(business.count);
            });
        }

        opendata.businessesByDistrict().then(onBizByDistrict, onError);
        opendata.businessesByIndustry().then(onBizByIndustry, onError);
        opendata.businessesByYear().then(onBizByYear, onError);

        $scope.getBusinessesByCity = getBusinessesByCity;

    }

    app.controller("MainController", MainController);
}());
