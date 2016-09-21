(function() {

    var app = angular.module("registeredBusinessAnalysis", ["ngRoute"]);

    app.filter('capitalize', function() {
        return function(input) {
          return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    });

    app.config(function($routeProvider) {
        //Want to craete 3 separate views
        // index.html will be the shell page (the layout view)
        // main.html (front page of the webiste)

        $routeProvider
            .when("/main", {
                templateUrl: "main.html",
                controller: "MainController" //since we specify the controller here, we don't need to specify in main.html
            })
            .otherwise({
                redirectTo: "/main"
            });
    });

}());
