describe("toString", function() {
    "use strict";

    it("should have overloaded toString", function() {
        var link = ugma.render("a"),
            input = ugma.render("input"),
            spans = ugma.renderAll("i+b");

        expect(link.toString()).toBe("<a>");
        expect(input.toString()).toBe("<input>");
        expect(spans.toString()).toBe("<i>,<b>");
    });
});
