(function(){

  var opendata = function($http){

    var getLocationCityData = function(city){
      return $http.get("https://data.sfgov.org/resource/vbiu-2p9h.json?city=" + city + "&$$app_token=Uw0ptivuIBN9JgGZLQtFZJ2In")
           .then(function(response){
             return response.data;
           });
    };

    return {
      getLocationCityData: getLocationCityData,
    };

  };

  var module = angular.module("registeredBusinessAnalysis") // Give me a reference to the module
  module.factory("opendata", opendata);

}());
