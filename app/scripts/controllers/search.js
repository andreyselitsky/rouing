'use strict';

angular.module('routeTestApp')
    .controller('SearchCtrl', function ($scope, $location, searchData) {
        $scope.search = searchData;

        $scope.$watch(function () {
            return $scope.search.selectedFilters
        }, function (newValue) {
            $location.search({filters: newValue});
        });
    });
