describe("toString", function() {
    "use strict";

    it("should have overloaded toString", function() {
        var link = ugma.add("a"),
            input = ugma.add("input"),
            spans = ugma.addAll("i+b");

        expect(link.toString()).toBe("<A>");
        expect(input.toString()).toBe("<INPUT>");
        expect(spans.toString()).toBe("<I>,<B>");
    });
});
