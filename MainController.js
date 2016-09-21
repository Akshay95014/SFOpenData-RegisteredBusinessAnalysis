(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata) {

        var onGotData = function(data) {
            $log.debug(data);
            $scope.queryData = data;
        };

        var onError = function() {
            $scope.error = "Couldn't fetch the data";
        }

        var getBusinessesByCity = function(city) {
            $log.debug("Made it into controller's getBusinessesByCity function.");
            opendata.getLocationCityData(city).then(onGotData, onError);
        };

        var onBizByDistrict = function(data) {
            $scope.businessByDistrict = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByDistrict, function(business) {
                business.supervisor_district = parseFloat(business.supervisor_district);
                business.count = parseFloat(business.count);
            });
        };

        var onBizByIndustry = function(data) {
            $scope.businessByIndustry = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByIndustry, function(business) {
                business.count = parseFloat(business.count);
            });
        }

        var onBizByYear = function(data) {
            var businessesOpenedByYear = data;
            $scope.businessesByYear = [];

            opendata.businessesByEndYear().then(function(close_data){
              var businessesClosedByYear = close_data;
              for (var key in businessesOpenedByYear){
                var currYear = (businessesOpenedByYear[key].year);
                var foundMatch = false;
                for (var close_key in businessesClosedByYear){
                  if(businessesClosedByYear[close_key].year === currYear){
                    $log.debug("MADE IT INTO THE IF STATEMENT!")
                    var obj = {};
                    obj.year = currYear;
                    obj.openedBusinesses = businessesOpenedByYear[key].count;
                    obj.closedBusinesses = businessesClosedByYear[close_key].count;
                    $scope.businessesByYear.push(obj);
                    foundMatch = true;
                    break;
                  }
                }
                if (!foundMatch){
                  var obj = {};
                  obj.year = currYear;
                  obj.openedBusinesses = businessesOpenedByYear[key].count;
                  obj.closedBusinesses = "-";
                  $scope.businessesByYear.push(obj);
                }
              }
              //This will convert all numeric strings to numbers
              angular.forEach($scope.businessByYear, function(business) {
                business.count = parseFloat(business.count);
              });
            }, onError);

        };

        opendata.businessesByDistrict().then(onBizByDistrict, onError);
        opendata.businessesByIndustry().then(onBizByIndustry, onError);
        opendata.businessesByStartYear().then(onBizByYear, onError);
      //  opendata.businessesByEndYear().then(onBizByYear, onError);

        $scope.getBusinessesByCity = getBusinessesByCity;

    };

    app.controller("MainController", MainController);
}());
