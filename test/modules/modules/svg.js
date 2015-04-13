describe("svg", function() {
    "use strict";

    it("should return false if not a SVG document", function() {
         expect( ugma.isSVG(ugma.render("div")[0])).toBe(false);
    });

});