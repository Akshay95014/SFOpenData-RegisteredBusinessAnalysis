(function() {

  var app = angular.module("registeredBusinessAnalysis");

  var DistrictController = function($scope, opendata, $routeParams, $timeout, $q) {

    //This function saves all businesses by neighborhood into the scope.
    var onBizByNeighborhood = function(data){
      $scope.neighborhoodBusinesses = data;

      $scope.neighborhoodBusinesses_forChart = [];

      //This will convert all numeric strings to numbers
      angular.forEach(data, function(business) {
          if (business.neighborhood) {
              business.count = parseFloat(business.count);
              $scope.neighborhoodBusinesses_forChart.push(business);
          }
      });

    }

    $scope.dataFromBizByNeighborhoodPromise = function() {
        var deferred = $q.defer();

        var data = $scope.neighborhoodBusinesses_forChart;

        deferred.resolve(data)
        return deferred.promise;
    };


    $scope.businessesByNeighborhoodChart = $timeout(function() {
        return {
            // we can also use a promise for the data property to delay the rendering of
            // the chart till we actually have data
            data: $scope.dataFromBizByNeighborhoodPromise(),
            type: "serial",
            theme: 'light',
            categoryField: "neighborhood",
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
                title: "Neighborhood"
            },
            valueAxes: [{
                position: "left",
                title: "Number of Businesses"
            }],
            graphs: [{
                type: "column",
                title: "# of Businesses",
                valueField: "count",
                fillAlphas: 1,
            }]
        }
    }, 1000)

    var onBizByIndustry = function(data){
      $scope.industryBusinesses = data;

      $scope.industryBusinesses_forChart = [];

      //This will convert all numeric strings to numbers
      angular.forEach(data, function(business) {
          if (business.industry) {
              business.count = parseFloat(business.count);
              $scope.industryBusinesses_forChart.push(business);
          }
      });
    }

    $scope.dataFromBizByIndustryPromise = function() {
        var deferred = $q.defer();

        var data = $scope.industryBusinesses_forChart;

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
                title: "Industry"
            },
            valueAxes: [{
                position: "left",
                title: "Number of Businesses"
            }],
            graphs: [{
                type: "column",
                title: "# of Businesses",
                valueField: "count",
                fillAlphas: 1,
            }]
        }
    }, 1000)

    var onError = function() {
        $scope.error = "Couldn't fetch the data";
    }

    $scope.district_num = $routeParams.district_num;

    opendata.businessesByNeighborhood($scope.district_num).then(onBizByNeighborhood, onError);
    opendata.businessesByIndustryInDistrict($scope.district_num).then(onBizByIndustry, onError);
    // opendata.activeBusinessesByYear("2016").then(function(){
    //   console.log("done!");
    // }, onError);
  };

  app.controller("DistrictController", DistrictController);

}());
