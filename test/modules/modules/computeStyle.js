describe("computeStyle", function() {
    "use strict";

    it("should not blow up when no element are provided", function() {
        expect(ugma.computeStyle()).toEqual(null);
    });

    it("should return computed styles for elements correctly", function() {

        ugma.query("body").css("height", "50px");

        var computed = ugma.computeStyle(ugma.query("body")[0]);

        expect(computed.height).toBe("50px");
    });

    it("should return computed styles for pseudo-elements correctly", function() {

        ugma.injectCSS("body:after", "content:'abc';");

        var computed = ugma.computeStyle(ugma.query("body")[0], ":after");

        expect(computed.content.indexOf("abc") > -1).toBe(true);
    });
});