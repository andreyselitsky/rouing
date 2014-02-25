'use strict';

angular.module('routeTestApp')
    .controller('SearchResultsCtrl', function ($scope, searchData) {
        $scope.results = searchData.results;
        $scope.term = searchData.term;
    });
