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

    it("should accept native node", function() {
        expect(ugma.contains(document.getElementsByTagName("a")[0])).toBeTruthy();
    });

    it("should only accept native node with nodeType 1", function() {
        expect(function() { ugma.contains(document.createComment("foo")[0])}).toThrow();
    });

    it("should return zero for node itself", function() {
        expect(testEl.contains(testEl)).toBe(0);
    });

    it("should throw error if the first argument is not a ugma or native node", function() {
        expect(function() { testEl.contains(2); }).toThrow();
    });

    it("should return false for empty node", function() {
        expect(ugma.query("some-node").contains(ugma)).toBe(false);
    });
});