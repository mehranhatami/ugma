describe("ugma.injectCSS", function() {
    "use strict";

    it("should accept selector with style string", function() {
        jasmine.sandbox.set("<a id='injectCSS1'></a>");

        var link = ugma.query("#injectCSS1");

        expect(link.css("display")).not.toBe("none");
        ugma.injectCSS("#injectCSS1", "display: none;");
        expect(link.css("display")).toBe("none");
    });

    it("should handle vendor prefixed properties", function() {
        jasmine.sandbox.set("<a id='injectCSS3'></a>");

        var link = ugma.query("#injectCSS3");

        expect(link.css("box-sizing")).not.toBe("border-box");
    });

    it("skips invalid selectors", function() {
        expect(function() {
            ugma.injectCSS("::-webkit-input-placeholder", "color:gray");
            ugma.injectCSS("::-moz-placeholder", "color:gray");
            ugma.injectCSS("input:-ms-input-placeholder", "color:gray");
        }).not.toThrow();
    });

    it("supports at-rules", function() {
        jasmine.sandbox.set("<a id='injectCSS4'></a>");

        var link = ugma.query("#injectCSS4");

        expect(link.css("display")).not.toBe("none");
        ugma.injectCSS("@media all", "#injectCSS4 {display: none}");
        expect(link.css("display")).toBe("none");
    });

 it("should handle vendor prefixed properties", function() {
        jasmine.sandbox.set("<a id='importStyles3'></a>");
        var link = ugma.query("#importStyles3");
        expect(link.css("box-sizing")).not.toBe("border-box");
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() { ugma.injectCSS(1); }).toThrow();
        expect(function() { ugma.injectCSS("a"); }).toThrow();
        expect(function() { ugma.injectCSS("a", null); }).toThrow();
    });
});