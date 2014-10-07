/* global xdescribe, Grid */

xdescribe('Grid', function () { 'use strict';

  it('should exist', function () {
    expect(Grid).toEqual(jasmine.any(Function));
  });

  it('should throw if no `M` arg provided', function () {
    expect(function(){
      new Grid();
    }).toThrow();
  });

  it('should not throw if only `M` is provided', function () {
    expect(function(){
      new Grid(5);
    }).not.toThrow();
  });

  describe('members', function () {

    var grid;

    beforeEach(function(){
      grid = new Grid(5, 4);
    });

    it('should have a flattened array on the data property', function () {
      expect(grid.data).toBeDefined();
      expect(grid.data.length).toBe(20);
    });
  });
});
