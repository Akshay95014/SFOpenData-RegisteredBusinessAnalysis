(function() {

    var app = angular.module("registeredBusinessAnalysis", ["ngRoute", "amChartsDirective", "ui.bootstrap", "uiGmapgoogle-maps"])
        .config(function(uiGmapGoogleMapApiProvider) { // configuration for Google Maps API
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyDRal0B3YwX-T7eAxHYDHDRvNWDXTIHoLI',
                v: '3.20',
                libraries: 'weather,geometry,visualization'
            });
        })


    //An added filter to make sure capitalization is done correctly in displayed data
    app.filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    });

    app.config(function($routeProvider) {
        //Want to craete 3 separate views
        // index.html will be the shell page (the layout view)
        // main.html (front page of the webiste)
        // city-search.html (custom search for businesses based on location_city)

        $routeProvider
            .when("/main", {
                templateUrl: "main.html",
                controller: "MainController" //since we specify the controller here, we don't need to specify in main.html
            })
            .when("/district/:district_num", {
                templateUrl: "district_details.html",
                controller: "DistrictController"
            })
            .when("/city-search", {
                templateUrl: "city-search.html",
                controller: "CitySearchController"
            })
            .otherwise({
                redirectTo: "/main"
            });
    });
    //
}());
