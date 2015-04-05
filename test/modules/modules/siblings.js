describe("siblings", function() {
    "use strict";

    var foo;

    beforeEach(function() {

        jasmine.sandbox.set("<div id='foo'></div>");

        foo = ugma.query("#foo");
    });

    it("should find itself if zero, or negative number", function() {
          expect(foo.sibling(0)).toBe(foo);
          expect(foo.sibling(-1)).toBe(foo);
    });
});