(function() {

    var opendata = function($http, $log) {

        var appKey = "&$$app_token=Uw0ptivuIBN9JgGZLQtFZJ2In";
        var yearConstraint = "location_start_date%20>%20'1969-12-31T11:59:59'";
        var twentyOneYearConstraint = "location_start_date%20>%20'2016-05-31T11:59:59'";

      //  https://data.sfgov.org/resource/vbiu-2p9h.json?$select=count(*),%20supervisor_district,%20date_trunc_y(location_start_date)&$group=supervisor_district,date_trunc_y(location_start_date)
        var newBusinessesByDistrictOverTime = function(){
          var queryString = "?$select=count(*),%20supervisor_district,%20date_trunc_y(location_start_date)";
          queryString += "&$where=location_start_date%20>%20'2007-01-01T00:00:00' AND location_start_date%20<%20'2017-01-01T00:00:00'";
          queryString += "&$order=date_trunc_y(location_start_date) ASC"
          queryString += "&$group=supervisor_district,date_trunc_y(location_start_date)";
          return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
              .then(function(response) {
                  return response.data;
              });
        };

        // Get
        var getLocationCityData = function(city) {
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json?city=" + city + "&$$app_token=Uw0ptivuIBN9JgGZLQtFZJ2In")
                .then(function(response) {
                    return response.data;
                });
        };

        var getBusinessNameData = function(name) {
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json?$where=dba_name like '%25" + name + "%25'&$$app_token=Uw0ptivuIBN9JgGZLQtFZJ2In")
                .then(function(response) {
                    return response.data;
                });
        };

        var getBusinessesForMap = function(){
          var queryString = "?$select=dba_name, location";
          queryString += "&$where=" + twentyOneYearConstraint;
          queryString += "AND city='San Francisco'";
          queryString += "AND naic_code_description='Professional, Scientific, and Technical Services'";
          return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
              .then(function(response) {
                  return response.data;
              });
        };

        var businessesByDistrict = function() {
            var queryString = "?$select=supervisor_district,%20count(*)";
            queryString += "&$where=" + yearConstraint;
            queryString += "&$group=supervisor_district";
            $log.debug("QueryString = "  + queryString);
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };



        var businessesByIndustry = function() {
            var queryString = "?$select=naic_code_description as industry,%20count(*)";
            queryString += "&$where=" + yearConstraint;
            queryString += "&$group=naic_code_description";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByStartYear = function() {
            var queryString = "?$select=date_trunc_y(location_start_date)%20as%20year,%20count(*)";
            queryString += "&$where=" + yearConstraint;
            queryString += "&$group=date_trunc_y(location_start_date)";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByEndYear = function() {
            var queryString = "?$select=date_trunc_y(location_end_date)%20as%20year,%20count(*)";
            queryString += "&$where=" + yearConstraint;
            queryString += "&$group=date_trunc_y(location_end_date)";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByNeighborhood = function(district) {
            var queryString = "?$select=neighborhoods_analysis_boundaries as neighborhood,%20count(*)";
            queryString += "&$where=supervisor_district='" + district + "'";
            queryString += "&$group=neighborhoods_analysis_boundaries";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByIndustryInDistrict = function(district) {
            var queryString = "?$select=naic_code_description as industry,%20count(*)";
            queryString += "&$where=supervisor_district='" + district + "'";
            queryString += "&$group=naic_code_description";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };


        var inactiveBusinessesByDistrict = function() {
            var queryString = "?$select=supervisor_district, count(*)";
            queryString += "&$where=location_end_date%20between%20%271800-01-01T00:00:00%27%20and%20%272059-12-31T11:59:59%27";
            queryString += "&$group=supervisor_district";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var inactiveBusinessesByIndustry = function() {
            var queryString = "?$select=naic_code_description as industry, count(*)";
            queryString += "&$where=location_end_date%20between%20%271800-01-01T00:00:00%27%20and%20%272059-12-31T11:59:59%27";
            queryString += "&$group=naic_code_description";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        // This function will return the # of active businesses in a given year.
        var activeBusinessesUpToYear = function(year) {
            var queryString = "?$select=count(*)";
            queryString += "&$where=location_start_date%20between%20%271800-01-01T00:00:00%27%20and%20%27" + year + "-12-31T11:59:59%27";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    var bufferData = response.data;

                    var totalNumBusinesses = bufferData[0].count;

                    return inactiveBusinessesUpToYear(year)
                        .then(function(inactive) {
                            totalNumBusinesses -= inactive[0].count;
                            return totalNumBusinesses;
                        });

                    // var responseData = [];
                    // for (var index in bufferData) {
                    //     if (bufferData[index].location_end_date) {
                    //         console.log("FOUND AN END DATE!");
                    //     } else {
                    //         responseData.push(bufferData[index]);
                    //     }
                    // }
                    // return responseData;
                });
        };

        // MAY NOT END UP NEEDING THIS
        var inactiveBusinessesUpToYear = function(year) {
            var queryString = "?$select=count(*)";
            queryString += "&$where=location_end_date%20between%20%271800-01-01T00:00:00%27%20and%20%27" + year + "-12-31T11:59:59%27";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var getAllYears = function() {
            var queryString = "?$select=date_trunc_y(location_start_date) as year &$group=date_trunc_y(location_start_date)";
            queryString += "&$where=" + yearConstraint;
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        }

        // var addToYearlyActiveBusinesses = function(yearlyActiveBusinesses, busInfo, year){
        //   var obj = {};
        //   obj.year = years[index].year;
        //   $log.debug("busInfo = " + busInfo);
        //   obj.activeBusinesses = busInfo;
        //   yearlyActiveBusinesses.push(obj);
        // }
        //
        // var activeBusinessesByYear = function() {
        //
        //     var yearlyActiveBusinesses = [];
        //
        //     return getAllYears().then(function(allYears) {
        //         var years = allYears;
        //         $log.debug("Years.length = " + years.length);
        //         for (var index in years) {
        //             if (years[index].year === "2201-01-01T00:00:00.000") { //Found a typo or a test entry in the dataset
        //                 continue;
        //             }
        //             var yearStr = years[index].year;
        //             $log.debug("yearStr = " + yearStr);
        //             var yearArr = yearStr.split("-");
        //             yearStr = yearArr[0];
        //             $log.debug("yearStr = " + yearStr);
        //
        //             activeBusinessesUpToYear(yearStr).then(addToYearlyActiveOrdersfunction(yearlyActiveBusinesses, busInfo, years[index].year) {
        //                 $log.debug("INside activeBusinessesUPtohyear");
        //                 var obj = {};
        //                 obj.year = years[index].year;
        //                 $log.debug("busInfo = " + busInfo);
        //                 obj.activeBusinesses = busInfo;
        //                 yearlyActiveBusinesses.push(obj);
        //                 $log.debug("yaerlyActiveBusinesses.length = " + yearlyActiveBusinesses.length);
        //             });
        //         }
        //         $log.debug("yaerlyActiveBusinesses.length = " + yearlyActiveBusinesses.length);
        //         return yearlyActiveBusinesses;
        //     });
        // };

        var activeBusinessesByDistrict = function() {
            return inactiveBusinessesByDistrict().then(function(inactiveBusinesses) {
                var closedBusinessesByDistrict = inactiveBusinesses;
                return businessesByDistrict().then(function(activeAndInactiveInDistrics) {
                    var allBusinessesByDistrict = activeAndInactiveInDistrics;
                    for (var index in allBusinessesByDistrict) {
                        var districtNum = allBusinessesByDistrict[index].supervisor_district;
                        for (var index_closed in closedBusinessesByDistrict) {
                            if (closedBusinessesByDistrict[index_closed].supervisor_district === districtNum) {
                                allBusinessesByDistrict[index].count -= closedBusinessesByDistrict[index_closed].count;
                            }
                        } // Close the closedBusinessesByDistrict for-loop
                    } // Close the allBusinessesByDistrict for-loop
                    return allBusinessesByDistrict;
                });
            });
        };

        var activeBusinessesByIndustry = function() {
            return inactiveBusinessesByIndustry().then(function(inactiveBusinesses) {
                var closedBusinessesByIndustry = inactiveBusinesses;
                return businessesByIndustry().then(function(activeAndInactiveInIndustry) {
                    var allBusinessesByIndustry = activeAndInactiveInIndustry;
                    for (var index in allBusinessesByIndustry) {
                        var industryName = allBusinessesByIndustry[index].industry;
                        for (var index_closed in closedBusinessesByIndustry) {
                            if (closedBusinessesByIndustry[index_closed].industry === industryName) {
                                allBusinessesByIndustry[index].count -= closedBusinessesByIndustry[index_closed].count;
                            }
                        } // Close the closedBusinessesByDistrict for-loop
                    } // Close the allBusinessesByDistrict for-loop
                    return allBusinessesByIndustry;
                });
            });
        };


        return {
            getLocationCityData: getLocationCityData,
            businessesByDistrict: businessesByDistrict,
            businessesByIndustry: businessesByIndustry,
            businessesByStartYear: businessesByStartYear,
            businessesByEndYear: businessesByEndYear,
            businessesByNeighborhood: businessesByNeighborhood,
            businessesByIndustryInDistrict: businessesByIndustryInDistrict,
            //activeBusinessesByYear: activeBusinessesByYear,
            activeBusinessesByDistrict: activeBusinessesByDistrict,
            activeBusinessesByIndustry: activeBusinessesByIndustry,
            getBusinessesForMap: getBusinessesForMap,
            newBusinessesByDistrictOverTime: newBusinessesByDistrictOverTime,
            getBusinessNameData: getBusinessNameData
        };

    };

    var module = angular.module("registeredBusinessAnalysis"); // Give me a reference to the module
    module.factory("opendata", opendata);

}());
