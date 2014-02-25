'use strict';

describe('Controller: SearchresultsCtrl', function () {

  // load the controller's module
  beforeEach(module('routeTestApp'));

  var SearchresultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchresultsCtrl = $controller('SearchresultsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
