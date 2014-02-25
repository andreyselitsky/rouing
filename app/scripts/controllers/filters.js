'use strict';

angular.module('routeTestApp')
    .controller('FiltersCtrl', function ($scope, searchData) {
        $scope.filters = searchData.filters;

        $scope.toggleFilter = function (filter) {
            filter.selected = !filter.selected;
            updateSelectedFilters();
        }

        var updateSelectedFilters = function () {
            searchData.selectedFilters =
                _.chain($scope.filters)
                    .where({selected: true})
                    .map(function (filter) {
                        return filter.id;
                    })
                    .value();
        }
    });
