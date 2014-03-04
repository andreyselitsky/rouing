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
        'velvet',
        'bmb.velvet.ui.search',
        'bmb.velvet.ui.folders'
    ])
    .config(function ($urlRouterProvider, $stateProvider, $velvetConfigProvider, $httpProvider) {
        var velvetConfig = {
            host: "https://velvet.navigator.kluwer.nl",
            apikey: "F68BB7701FFB4C52B485AA1A8E5B425C"
        };

        $velvetConfigProvider.configure(velvetConfig);

        $httpProvider.defaults.headers.common['Authorization'] = "Twill-RC4-Token : $!9BE21DBD693888F125A51FDBAC4231D23C50313731622E88AB2E8B0FB28A72014BC1B90D7DEEBDFED1B24FF36C2327E8D8375BF7AE408FC00B08CE99E9D5EC1E2A6FD5E127915E8ACEB596A9E25D77B57C4ACB013C8DE83498EBF6A0";
        $httpProvider.defaults.headers.common['X-ApiKey'] = velvetConfig.apikey;

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
            .state('folders', {
                url: '/folders',
                resolve: {
                    folders: function (/*vlv.rsi.entitySets.Folders*/vlvRsiFolders) {
                        return vlvRsiFolders.getAll();
                    }
                },
                views: {
                    "": {
                        template: '<bmb-folders></bmb-folders>',
                        controller: 'FoldersCtrl'
                    },
                    "toolbar": {
                        templateUrl: 'views/toolbar.html'
                    }
                }
            })
            .state('folders.documents', {
                url: '/:folderId',
                controller: 'FolderDocumentsCtrl',
                template: '<bmb-folders-documents></bmb-folders-documents>'
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
