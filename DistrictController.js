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

    // Used for creating the neighborhood chart
    $scope.dataFromBizByNeighborhoodPromise = function() {
        var deferred = $q.defer();

        var data = $scope.neighborhoodBusinesses_forChart;

        deferred.resolve(data)
        return deferred.promise;
    };

    // Set the AMCHARTS Properties
    $scope.businessesByNeighborhoodChart = $timeout(function() {
        return {
            data: $scope.dataFromBizByNeighborhoodPromise(),
            type: "serial",
            theme: 'light',
            categoryField: "neighborhood",
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


    //This function saves all businesses by industry into the scope.
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

    // Used for creating the industry chart
    $scope.dataFromBizByIndustryPromise = function() {
        var deferred = $q.defer();

        var data = $scope.industryBusinesses_forChart;

        deferred.resolve(data)
        return deferred.promise;
    };

    // Set the AMCHARTS Properties for the Industry Chart
    $scope.businessesByIndustryChart = $timeout(function() {
        return {
            data: $scope.dataFromBizByIndustryPromise(),
            type: "serial",
            theme: 'light',
            categoryField: "industry",
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

    //Store the district from the route parameters
    $scope.district_num = $routeParams.district_num;

    // Make API calls for data
    opendata.businessesByNeighborhood($scope.district_num).then(onBizByNeighborhood, onError);
    opendata.businessesByIndustryInDistrict($scope.district_num).then(onBizByIndustry, onError);
  };

  app.controller("DistrictController", DistrictController);

}());
