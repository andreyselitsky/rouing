/**
 * Created by Andrey Selitsky on 2/18/14.
 */
angular.module('bmb.velvet.ui.search', ['bmb.data'])
    .controller('SearchCtrl', function ($scope, $location, stubData) {
        this.init = function(){
            performSearch();

            $scope.$on('$locationChangeSuccess',function(evt, absNewUrl, absOldUrl) {
                performSearch();
            });

            $scope.runSearch = function () {
                updateUrl();
            }

            $scope.toggleFilter = function (filter) {
                filter.selected = !filter.selected;
                updateSelectedFilters();
                updateUrl();
            }
        }
        var performSearch = function(){
            $scope.search = stubData.getData($location.search());
        };

        var updateSelectedFilters = function () {
            $scope.search.selectedFilters =
                _.chain($scope.search.filters)
                    .where({selected: true})
                    .map(function (filter) {
                        return filter.id;
                    })
                    .value();
        }

        var updateUrl = function () {
            $location.search({term: $scope.search.term, filters: $scope.search.selectedFilters});
        }
    })
    .constant('baseConfig', {
        templateUrl: function (file) {
            return 'app/modules/search/templates/' + file;
        }
    })
    .directive('bmbSearch', function (baseConfig) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: baseConfig.templateUrl('layout.html'),
            controller: 'SearchCtrl',
            link: function(scope, element, attrs, controller) {
                controller.init();
            }
        }
    })
    .directive('bmbSearchFilters', function (baseConfig) {
        return {
            restrict: 'E',
            require: '^bmbSearch',
            replace: true,
            templateUrl: baseConfig.templateUrl('filters.html')
        }
    })
    .directive('bmbSearchInput', function (baseConfig) {
        return {
            restrict: 'E',
            require: '^bmbSearch',
            replace: true,
            templateUrl: baseConfig.templateUrl('input.html')
        }
    })
    .directive('bmbSearchResults', function (baseConfig) {
        return {
            restrict: 'E',
            require: '^bmbSearch',
            replace: true,
            templateUrl: baseConfig.templateUrl('results.html')
        }
    });