(function() {

    var app = angular.module("registeredBusinessAnalysis");

    var MainController = function($scope, $log, $location, opendata, $timeout, $q, uiGmapGoogleMapApi) {

        // Enables sorting by year for businesses by year graph
        function compare(a, b) {
            if (a.year < b.year)
                return -1;
            if (a.year > b.year)
                return 1;
            return 0;
        }

        function compareDistricts(a, b) {
            if (a.supervisor_district < b.supervisor_district)
                return -1;
            if (a.supervisor_district > b.supervisor_district)
                return 1;
            return 0;
        }

        var onError = function() {
            $scope.error = "Couldn't fetch the data";
        }

        // var getBusinessesByCity = function(city) {
        //     opendata.getLocationCityData(city).then(onGotData, onError);
        // };

        // Businesses by District
        var onBizByDistrict = function(data) {
            $scope.businessByDistrict = data;
            $scope.totalBusinesses = 0;

            angular.forEach($scope.businessByDistrict, function(business) {
                $scope.totalBusinesses += parseFloat(business.count);
            });

            $scope.businessByDistrict_forChart = [];

            // Get % of businesses for each district
            angular.forEach(data, function(business) {
                if (business.supervisor_district) {
                    business.supervisor_district = parseFloat(business.supervisor_district);
                    business.count = parseFloat(business.count);
                    business.percent = ((business.count / $scope.totalBusinesses) * 100).toFixed(2);
                    $scope.businessByDistrict_forChart.push(business);
                }
            });
            $scope.businessByDistrict_forChart.sort(compareDistricts);
          //  $scope.dataFromBizByDistPromise();
        };

        // Prepare AMCHARTS data for businesses by district
        $scope.dataFromBizByDistPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessByDistrict_forChart;

            deferred.resolve(data)
            return deferred.promise;
        };

        //Amchart options for businesses by district
        $scope.businessesByDistrictChart = $timeout(function() {
            return {
                data: $scope.dataFromBizByDistPromise(),
                type: "serial",
                theme: 'light',
                categoryField: "supervisor_district",
                rotate: false,
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
        }, 5000)

        // Get businesses by industry
        var onBizByIndustry = function(data) {
            $scope.businessByIndustry = data;

            angular.forEach($scope.businessByIndustry, function(business) {
                business.count = parseFloat(business.count);
            });

            $scope.businessByIndustry_forChart = [];

            //Get percentage of businesses by industry
            angular.forEach(data, function(business) {
                if (business.industry) {
                    business.count = parseFloat(business.count);
                    business.percent = ((business.count / $scope.totalBusinesses) * 100).toFixed(2);
                    $scope.businessByIndustry_forChart.push(business);
                }
            });
        };

        // Prepare AMCHARTS data for businesses by industry
        $scope.dataFromBizByIndustryPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessByIndustry_forChart;

            deferred.resolve(data)
            return deferred.promise;
        };

        //Amchart options for businesses by industry
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
        }, 5000)

        // Get businesses by year
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
            }, onError);
        };


        var onActiveBizByYear = function(data) {
            $scope.activeBusinessesByYear = data;
        };

        //Prepare data for business by year chart
        $scope.dataFromBizByYearPromise = function() {
            var deferred = $q.defer();

            var data = $scope.businessesByYear;

            deferred.resolve(data)
            return deferred.promise;
        };

        //AMCHARTS options for businesses by year
        $scope.businessesByYearChart = $timeout(function() {
            return {
                data: $scope.dataFromBizByYearPromise(),
                type: "serial",
                theme: 'light',
                categoryField: "year",
                rotate: false,
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
        }, 5000)



        // PREPARE DATA FOR GOOGLE MAPS
        $scope.markers = [];


        var onMapData = function(data) {
            $scope.addresses = [];

            for (var index in data) {
                if (data[index].location) {
                    var obj = {};
                    obj.name = data[index].dba_name;
                    obj.lat = data[index].location.coordinates[1];
                    obj.long = data[index].location.coordinates[0];
                    $scope.addresses.push(obj);
                }

            }

            uiGmapGoogleMapApi.then(function(maps) {
                $scope.map = {
                    center: {
                        latitude: 37.7749,
                        longitude: -122.4194
                    },
                    zoom: 13
                };

                for (var i = 0; i < $scope.addresses.length; i++) {
                    $scope.markers.push({
                        id: $scope.markers.length,
                        coords: {
                            latitude: $scope.addresses[i].lat,
                            longitude: $scope.addresses[i].long
                        },
                    });
                }
                $log.debug($scope.markers[0]);
            });
        }


        opendata.activeBusinessesByDistrict().then(onBizByDistrict, onError);     //Active businesses by district API response
        opendata.activeBusinessesByIndustry().then(onBizByIndustry, onError);     //Active businesses by industry API response
        opendata.businessesByStartYear().then(onBizByYear, onError);              //New and closed businesses by year API response
        opendata.getBusinessesForMap().then(onMapData, onError);                  //Data for map API response

        // $scope.getBusinessesByCity = getBusinessesByCity;


    };

    app.controller("MainController", MainController);
}());
