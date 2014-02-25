/**
 * Created by Andrey Selitsky on 2/24/14.
 */
describe('Unit: Testing search directives', function () {
    var $compile;
    var $scope;
    var directive;

    beforeEach(module('bmb.velvet.ui.search', 'bmb.data'));

    var templates = _.map(['layout.html', 'input.html', 'filters.html', 'results.html'], function (item) {
        return 'app/modules/search/templates/' + item;
    });

    beforeEach(module.apply(this, templates));

    beforeEach(inject(function ($rootScope, $controller, _$compile_, $location, stubData) {
        $scope = $rootScope.$new();
        $compile = _$compile_;

        var ctrl = $controller('SearchCtrl', {
            $scope: $scope,
            $location: $location,
            stubData: stubData
        });

        ctrl.init();

        directive = angular.element('<bmb-search></bmb-search>');
        $compile(directive)($scope);
        $scope.$digest();
    }));

    it('should render bmb-search directive with correct filters number', function () {
        expect(directive).not.toBe(null);
        expect(directive.find('ul.filters a.list-group-item').length).toBe($scope.search.filters.length);
    });

    it('should mark filter as selected', function () {
        var filter = _.sample($scope.search.filters);
        $scope.toggleFilter(filter);
        $scope.$digest();
        var filterContent = directive.find('a.active').text();

        expect(filterContent).toMatch(filter.name);
    });

    it('should update selectedFilters collection on click', function () {
        directive.find('a.list-group-item').first().click();
        $scope.$digest();

        expect($scope.search.selectedFilters.length).toBe(1);
    });

    it('should update url selecting/deselecting filter', function () {
        var filter = _.sample($scope.search.filters);
        $scope.toggleFilter(filter);
        $scope.$digest();

        expect($scope.search.selectedFilters.length).toBe(1);
    });

    it('should change search results count when changing filters', function () {
        var oldCount = $scope.search.results.length;

        directive.find('a.list-group-item').first().click();
        $scope.$digest();

        expect($scope.search.results.length).not.toBe(oldCount);
    });

    it('should call stubData.getData when changing search term', inject(function (stubData) {
        spyOn(stubData, 'getData');

        var input = directive.find('input');
        input.val('taxes');
        directive.find('button').click();

        expect(stubData.getData).toHaveBeenCalled();
    }));
});
