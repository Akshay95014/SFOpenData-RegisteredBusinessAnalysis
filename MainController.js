(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata, $timeout, $q, uiGmapGoogleMapApi) {

        function compare(a, b) {
            if (a.year < b.year)
                return -1;
            if (a.year > b.year)
                return 1;
            return 0;
        }


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
            $scope.totalBusinesses = 0;

            angular.forEach($scope.businessByDistrict, function(business) {
                $scope.totalBusinesses += parseFloat(business.count);
            });

            $scope.businessByDistrict_forChart = [];

            //This will convert all numeric strings to numbers
            angular.forEach(data, function(business) {
                if (business.supervisor_district) {
                    business.supervisor_district = parseFloat(business.supervisor_district);
                    business.count = parseFloat(business.count);
                    business.percent = ((business.count / $scope.totalBusinesses) * 100).toFixed(2);
                    $scope.businessByDistrict_forChart.push(business);
                }
            });
        };

        $scope.dataFromBizByDistPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessByDistrict_forChart;

            deferred.resolve(data)
            return deferred.promise;
        };


        $scope.businessesByDistrictChart = $timeout(function() {
            return {
                // we can also use a promise for the data property to delay the rendering of
                // the chart till we actually have data
                data: $scope.dataFromBizByDistPromise(),
                type: "serial",
                theme: 'light',
                categoryField: "supervisor_district",
                rotate: false,
                // pathToImages: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/images/',
                legend: {
                    enabled: true
                },
                chartScrollbar: {
                    enabled: true,
                },
                categoryAxis: {
                    gridPosition: "start",
                    parseDates: false,
                    minHorizontalGap: 0,
                    labelRotation: 45
                },
                valueAxes: [{
                    id: "numBiz",
                    position: "left",
                    title: "Number of Businesses",
                }, {
                    id: "percBiz",
                    position: "right",
                    title: "Percent of Businesses",
                    "unit": "%"
                }],
                graphs: [{
                    valueAxis: "numBiz",
                    type: "column",
                    title: "# of Businesses",
                    valueField: "count",
                    balloonText: "District [[category]]:<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    fillAlphas: 1
                }, {
                    valueAxis: "percBiz",
                    type: "column",
                    title: "% of Businesses",
                    valueField: "percent",
                    balloonText: "District [[category]]:<br><b><span style='font-size:14px;'>[[value]]%</span></b>",
                    fillAlphas: 1
                }]
            }
        }, 1000)

        var onBizByIndustry = function(data) {
            $scope.businessByIndustry = data;

            //This will convert all numeric strings to numbers
            angular.forEach($scope.businessByIndustry, function(business) {
                business.count = parseFloat(business.count);
            });

            $scope.businessByIndustry_forChart = [];

            //This will convert all numeric strings to numbers
            angular.forEach(data, function(business) {
                if (business.industry) {
                    //business.industry = parseFloat(business.supervisor_district);
                    business.count = parseFloat(business.count);
                    business.percent = ((business.count / $scope.totalBusinesses) * 100).toFixed(2);
                    $scope.businessByIndustry_forChart.push(business);
                }
            });
        };

        $scope.dataFromBizByIndustryPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessByIndustry_forChart;

            deferred.resolve(data)
            return deferred.promise;
        };


        $scope.businessesByIndustryChart = $timeout(function() {
            return {
                // we can also use a promise for the data property to delay the rendering of
                // the chart till we actually have data
                data: $scope.dataFromBizByIndustryPromise(),
                type: "serial",
                theme: 'light',
                categoryField: "industry",
                rotate: false,
                // pathToImages: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/images/',
                legend: {
                    enabled: true
                },
                chartScrollbar: {
                    enabled: true,
                },
                categoryAxis: {
                    gridPosition: "start",
                    parseDates: false,
                    minHorizontalGap: 0,
                    labelRotation: 45,
                    labelFrequency: 1
                },
                valueAxes: [{
                    id: "numBiz",
                    position: "left",
                    title: "Number of Businesses"
                }, {
                    id: "percBiz",
                    position: "right",
                    title: "Percent of Businesses",
                    "unit": "%"
                }],
                graphs: [{
                    valueAxis: "numBiz",
                    type: "column",
                    title: "# of Businesses",
                    valueField: "count",
                    balloonText: "[[category]]:<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    fillAlphas: 1,
                }, {
                    valueAxis: "percBiz",
                    type: "column",
                    title: "% of Businesses",
                    valueField: "percent",
                    balloonText: "[[category]]:<br><b><span style='font-size:14px;'>[[value]]%</span></b>",
                    fillAlphas: 1,
                }]
            }
        }, 1000)

        var onBizByYear = function(data) {
            var businessesOpenedByYear = data;
            $scope.businessesByYear = [];

            opendata.businessesByEndYear().then(function(close_data) {
                var businessesClosedByYear = close_data;
                for (var key in businessesOpenedByYear) {
                    var currYear = (businessesOpenedByYear[key].year);
                    var yearArr = currYear.split("-");
                    currYear = yearArr[0];
                    var foundMatch = false;
                    if (currYear === "2201") {
                        continue;
                    }
                    for (var close_key in businessesClosedByYear) {
                        if (businessesClosedByYear[close_key].year === currYear + "-01-01T00:00:00.000") {
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
                $scope.businessesByYear.sort(compare);
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

        $scope.dataFromBizByYearPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessesByYear;

            deferred.resolve(data)
            return deferred.promise;
        };


        $scope.businessesByYearChart = $timeout(function() {
            return {
                // we can also use a promise for the data property to delay the rendering of
                // the chart till we actually have data
                data: $scope.dataFromBizByYearPromise(),
                type: "serial",
                theme: 'light',
                categoryField: "year",
                rotate: false,
                // pathToImages: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/images/',
                legend: {
                    enabled: true
                },
                chartScrollbar: {
                    enabled: true,
                },
                categoryAxis: {
                    gridPosition: "start",
                    parseDates: false,
                    labelRotation: 45
                },
                valueAxes: [{
                    position: "left",
                    title: "Number of Businesses"
                }],
                graphs: [{
                    type: "column",
                    title: "New Businesses",
                    valueField: "openedBusinesses",
                    balloonText: "Opened in [[category]]:<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    fillAlphas: 1,
                }, {
                    type: "column",
                    title: "Closed Businesses",
                    valueField: "closedBusinesses",
                    balloonText: "Closed in [[category]]:<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    fillAlphas: 1,
                }]
            }
        }, 1000)

        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = { center: { latitude: 37.7749, longitude: -122.4194 }, zoom: 13 };
        });

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
