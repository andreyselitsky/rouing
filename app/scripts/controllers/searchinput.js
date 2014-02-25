'use strict';

angular.module('routeTestApp')
    .controller('SearchInputCtrl', function ($scope, $location, searchData) {
        $scope.term = searchData.term;

        $scope.runSearch = function () {
            if ($scope.term) {
                $location.path('/search').search({term: $scope.term});
            }
        };
    });
