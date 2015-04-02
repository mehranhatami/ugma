describe("toString", function() {
    "use strict";

    it("should have overloaded toString", function() {
        var link = ugma.render("a"),
            input = ugma.render("input"),
            spans = ugma.renderAll("i+b");

        expect(link.toString()).toBe("<A>");
        expect(input.toString()).toBe("<INPUT>");
        expect(spans.toString()).toBe("<I>,<B>");
    });
});
