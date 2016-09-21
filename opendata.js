(function() {

    var opendata = function($http) {

        var appKey = "&$$app_token=Uw0ptivuIBN9JgGZLQtFZJ2In";

        var getLocationCityData = function(city) {
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json?city=" + city + "&$$app_token=Uw0ptivuIBN9JgGZLQtFZJ2In")
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByDistrict = function() {
            var queryString = "?$select=supervisor_district,%20count(*)&$group=supervisor_district";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByIndustry = function() {
            var queryString = "?$select=naic_code_description,%20count(*)&$group=naic_code_description";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByStartYear = function() {
            var queryString = "?$select=date_trunc_y(dba_start_date)%20as%20year,%20count(*)&$group=date_trunc_y(dba_start_date)";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByEndYear = function() {
            var queryString = "?$select=date_trunc_y(dba_end_date)%20as%20year,%20count(*)&$group=date_trunc_y(dba_end_date)";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };

        var businessesByNeighborhood = function(district) {
            var queryString = "?$select=neighborhoods_analysis_boundaries as neighborhood,%20count(*)&$where=supervisor_district='" + district + "'&$group=neighborhoods_analysis_boundaries"
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        }

        var businessesByIndustryInDistrict = function(district) {
            var queryString = "?$select=naic_code_description as industry,%20count(*)&$where=supervisor_district='" + district + "'&$group=naic_code_description";
            return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json" + queryString + appKey)
                .then(function(response) {
                    return response.data;
                });
        };


        return {
            getLocationCityData: getLocationCityData,
            businessesByDistrict: businessesByDistrict,
            businessesByIndustry: businessesByIndustry,
            businessesByStartYear: businessesByStartYear,
            businessesByEndYear: businessesByEndYear,
            businessesByNeighborhood: businessesByNeighborhood,
            businessesByIndustryInDistrict: businessesByIndustryInDistrict
        };

    };

    var module = angular.module("registeredBusinessAnalysis") // Give me a reference to the module
    module.factory("opendata", opendata);

}());
