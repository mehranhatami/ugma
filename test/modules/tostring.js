describe("Node", function() {
    "use strict";

    it("should have overloaded toString", function() {
        var link = ugma.add("a"),
            input = ugma.add("input"),
            spans = ugma.addAll("i+b"),
          //  empty = ugma.mock();

        expect(link.toString()).toBe("<a>");
        expect(input.toString()).toBe("<input>");
        expect(spans.toString()).toBe("<i>,<b>");
          //        expect(empty.toString()).toBe("");
    });
});
