'use strict';

var debug = function ($rootScope) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
    });
    $rootScope.$on('$stateChangeError', function () {
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
    });
    $rootScope.$on('$viewContentLoaded', function (event) {
        console.log('$viewContentLoaded - fired after dom rendered', event);
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
    });
};

angular.module('routeTestApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.router',
        'ui.bootstrap',
        'bmb.velvet.ui.search'
    ])
    .config(function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                views: {
                    "": {
                        templateUrl: 'views/main.html'
                    },
                    "toolbar": {
                        templateUrl: 'views/toolbar.html'
                    }
                }
            })
            .state('search', {
                url: '/search',
                views: {
                    "": {
                        template: '<bmb-search></bmb-search>'
                    },
                    "toolbar": {
                        templateUrl: 'views/toolbar.html'
                    }
                }
            })
            .state('document', {
                url: '/document/:id',
                views: {
                    "": {
                        templateUrl: 'views/document.html',
                        controller: 'DocumentCtrl'
                    },
                    "toolbar": {
                        templateUrl: 'views/toolbar.html'
                    }
                }
            });
    }).run(debug);
