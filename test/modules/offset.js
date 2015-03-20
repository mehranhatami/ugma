describe("offset", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='#'>test</a>");

        link = ugma.query("#test");
    });

    it("should return object without getBoundingClientRect", function() {
      // Simulates a browser without gBCR on elements, we just want to return 0,0,0,0
  	  var result = ugma.offset();
        expect(result.top).toBe(0);
        expect(result.left).toBe(0);
    });

    it("should return nothing on disconnected node", function() {
      // Simulates a browser without gBCR on elements, we just want to return 0,0,0,0
  	  var result = ugma.native( document.createElement("div") ).offset();
        expect(result).not.toBeDefined();
    });

  
    it("should return object with valid properties", function() {
        var offset = link.offset();

        expect(offset).toBeDefined();
        expect(offset.left).toBeLessThan(offset.right);
        expect(offset.top).toBeLessThan(offset.bottom);
        expect(offset.width).toBe(offset.right - offset.left);
        expect(offset.height).toBe(offset.bottom - offset.top);
    });

    it("should not change offsets when window is scrolling", function() {
        var normalize = function(offset) {
                var result = {};

                Object.keys(offset).forEach(function(key) {
                    result[key] = Math.floor(offset[key]);
                });

                return result;
            },
            offset = normalize(link.offset());

        window.scrollTo(0, window.outerHeight);

        expect(normalize(link.offset())).toEqual(offset);
    });

});
