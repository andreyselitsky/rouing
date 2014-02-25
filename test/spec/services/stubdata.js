'use strict';

describe('Service: Stubdata', function () {

  // load the service's module
  beforeEach(module('routeTestApp'));

  // instantiate service
  var Stubdata;
  beforeEach(inject(function (_Stubdata_) {
    Stubdata = _Stubdata_;
  }));

  it('should do something', function () {
    expect(!!Stubdata).toBe(true);
  });

});
