/**
 * Created by Andrey Selitsky on 2/21/14.
 */
describe('Unit: Testing SearchCtrl controller', function () {
    var $compile;
    var $scope;

    beforeEach(module('bmb.velvet.ui.search', 'bmb.data'));

    beforeEach(inject(function ($rootScope, $controller, _$compile_, $location, stubData) {
        $scope = $rootScope.$new();
        $compile = _$compile_;

        var ctrl = $controller('SearchCtrl', {
            $scope: $scope,
            $location: $location,
            stubData: stubData
        });

        ctrl.init();
    }));

    it('should have scope.search initialized', function () {
        expect($scope.search).not.toBe(null);
    });

    it('should toggle selected filter', function () {
        var filter = {};
        $scope.toggleFilter(filter);
        expect(filter.selected).toBe(true);
    });

    it('should update selected filters count on toggle filter', function () {
        var filter = _.sample($scope.search.filters);
        $scope.toggleFilter(filter);
        expect($scope.search.selectedFilters.length).toBe(1);
    });
});