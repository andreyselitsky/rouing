'use strict';

describe('Controller: SearchinputCtrl', function () {

  // load the controller's module
  beforeEach(module('routeTestApp'));

  var SearchinputCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchinputCtrl = $controller('SearchinputCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
