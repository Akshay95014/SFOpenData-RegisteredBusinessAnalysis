(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata) {

        var onGotData = function(data) {
            $scope.queryData = data;
        };

        var onError = function() {
            $scope.error = "Couldn't fetch the data";
        }

        var getBusinessesByCity = function(city) {
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

            opendata.businessesByEndYear().then(function(close_data) {
                var businessesClosedByYear = close_data;
                for (var key in businessesOpenedByYear) {
                    var currYear = (businessesOpenedByYear[key].year);
                    var foundMatch = false;
                    if (currYear === "2201-01-01T00:00:00.000") {
                        continue;
                    }
                    for (var close_key in businessesClosedByYear) {
                        if (businessesClosedByYear[close_key].year === currYear) {
                            var obj = {};
                            obj.year = currYear;
                            obj.openedBusinesses = businessesOpenedByYear[key].count;
                            obj.closedBusinesses = businessesClosedByYear[close_key].count;
                            $scope.businessesByYear.push(obj);
                            foundMatch = true;
                            break;
                        }
                    }
                    if (!foundMatch) {
                        var obj = {};
                        obj.year = currYear;
                        obj.openedBusinesses = businessesOpenedByYear[key].count;
                        obj.closedBusinesses = "-";
                        $scope.businessesByYear.push(obj);
                    }
                }
                //This will convert all numeric strings to numbers
                // angular.forEach($scope.businessByYear, function(business) {
                //     business.count = parseFloat(business.count);
                // });
            }, onError);
            /*$log.debug("About to do the activebusinessesbyyear");
            opendata.activeBusinessesByYear().then(function(activeBusinesses) {
              for (var index in $scope.businessesByYear) {
                var currYear = $scope.businessesByYear[index].year;
                $log.debug("activeBusinesses = " + activeBusinesses.length);
                for (var active_index in activeBusinesses) {
                  $log.debug("CurrYear = " + currYear + ", and activeBusinesses = " + activeBusinesses[active_index].year);
                  if (currYear === activeBusinesses[active_index].year) {
                    $log.debug("Inside maincontroller. Active businesses = " + activeBusinesses[active_index].activeBusinesses);
                    $scope.businessesByYear[index].activeBusinesses = activeBusinesses[active_index].activeBusinesses;
                  }
                }
              }
            }, onError);*/
        };


        var onActiveBizByYear = function(data) {
            $scope.activeBusinessesByYear = data;

            //This will convert all numeric strings to numbers
            // angular.forEach($scope.activeBusinessesByYear, function(business) {
            //     business.activeBusinesses = parseFloat(business.activeBusinesses);
            // });
        };

        //  opendata.businessesByDistrict().then(onBizByDistrict, onError);
        opendata.activeBusinessesByDistrict().then(onBizByDistrict, onError);
        opendata.activeBusinessesByIndustry().then(onBizByIndustry, onError);
        opendata.businessesByStartYear().then(onBizByYear, onError);
        //opendata.activeBusinessesByYear().then(onActiveBizByYear, onError);
        //  opendata.businessesByEndYear().then(onBizByYear, onError);

        $scope.getBusinessesByCity = getBusinessesByCity;

    };

    app.controller("MainController", MainController);
}());
