(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata, $timeout, $q) {

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
                if (business.supervisor_district)
                    business.supervisor_district = parseFloat(business.supervisor_district);
                else {
                    business.supervisor_district = 450;
                }
                business.count = parseFloat(business.count);
            });

            // $scope.amChartBusinessesByDistrict = {
            //     data: [{
            //         "supervisor_district": 4,
            //         "count": 3
            //     }],
            //     "marginTop": 25,
            //     type: "serial",
            //     theme: "light",
            //     titles: [{
            //         "size": 15,
            //         "text": "Active Businesses by District"
            //     }],
            //     rotate: false,
            //     categoryField: "supervisor_district",
            //     categoryAxis: {
            //         gridPosition: "start",
            //         parseDates: false,
            //         labelRotation: 45
            //     },
            //     chartScrollbar: {
            //         enabled: true,
            //     },
            //     valueAxes: [{
            //         position: "left",
            //         title: "Number"
            //     }],
            //     graphs: [{
            //         type: "column",
            //         fillAlphas: 1,
            //         title: "Active",
            //         valueField: "count",
            //     }],
            //     export: {
            //         enabled: true,
            //     },
            // };

            // $log.debug($scope.businessByDistrict);
            // $scope.$broadcast('amCharts.renderChart', $scope.businessByDistrict, 'businessesByDistrictChart');
            //$scope.showCharts = true;
        };

        $scope.dataFromPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessByDistrict;

            deferred.resolve(data)
            return deferred.promise;
        };


        $scope.amChartOptions = $timeout(function() {
            return {
                // we can also use a promise for the data property to delay the rendering of
                // the chart till we actually have data
                data: $scope.dataFromPromise(),
                type: "serial",
                theme: 'black',
                categoryField: "supervisor_district",
                rotate: true,
                pathToImages: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/images/',
                legend: {
                    enabled: true
                },
                chartScrollbar: {
                    enabled: true,
                },
                categoryAxis: {
                    gridPosition: "start",
                    parseDates: false
                },
                valueAxes: [{
                    position: "top",
                    title: "Million USD"
                }],
                graphs: [{
                    type: "column",
                    title: "Income",
                    valueField: "count",
                    fillAlphas: 1,
                }]
            }
        }, 1000)

        var onBizByIndustry = function(data) {
            $scope.businessByIndustry = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByIndustry, function(business) {
                business.count = parseFloat(business.count);
            });
        };

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
        $scope.onBizByIndustry = onBizByIndustry;


        // $scope.amChartOptions = {
        //     data: [{
        //         year: 2005,
        //         income: 23.5,
        //         expenses: 18.1
        //     }, {
        //         year: 2006,
        //         income: 26.2,
        //         expenses: 22.8
        //     }, {
        //         year: 2007,
        //         income: 30.1,
        //         expenses: 23.9
        //     }, {
        //         year: 2008,
        //         income: 29.5,
        //         expenses: 25.1
        //     }, {
        //         year: 2009,
        //         income: 24.6,
        //         expenses: 25
        //     }],
        //     type: "serial",
        //
        //     categoryField: "year",
        //     rotate: false,
        //     pathToImages: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/images/',
        //     legend: {
        //         enabled: true
        //     },
        //     chartScrollbar: {
        //         enabled: false,
        //     },
        //     categoryAxis: {
        //         gridPosition: "start",
        //         parseDates: false
        //     },
        //     valueAxes: [{
        //         position: "bottom",
        //         title: "Million USD"
        //     }],
        //     graphs: [{
        //         type: "column",
        //         title: "Income",
        //         valueField: "income",
        //         fillAlphas: 1,
        //     }]
        // };

        //*****AMCHARTS*****//
        //amCharts Weekly Orders

    };

    app.controller("MainController", MainController);
}());
