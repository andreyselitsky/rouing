'use strict';

angular.module('routeTestApp')
    .controller('MainCtrl', function ($scope, $location) {
        $scope.runSearch = function () {
            if ($scope.term) $location.path('/search').search({term: $scope.term});
        };
    });

