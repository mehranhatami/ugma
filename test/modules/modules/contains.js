   describe("contains", function() {
    "use strict";

    var testEl;

    beforeEach(function() {
        jasmine.sandbox.set("<div id='test'><a></a><a></a></div>");

        testEl = ugma.query("#test");
    });

    it("should accept a ugma element", function() {
        expect(testEl.contains(testEl.query("a"))).toBeTruthy();
    });

    it("should return zero for node itself", function() {
        expect(testEl.contains(testEl)).toBe(0);
    });

    it("should throw error if the first argument is not a ugma node", function() {
        expect(function() { testEl.contains(2); }).toThrow();
    });

    it("should return false for empty node", function() {
        expect(ugma.query("some-node").contains(ugma)).toBe(false);
    });
    
   
    
});