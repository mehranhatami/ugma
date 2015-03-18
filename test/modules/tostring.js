describe("Node", function() {
    "use strict";
 
    it("should have overloaded toString", function() {
        var link = ugma.native(document.createElement("a")),
            input = ugma.native(document.createElement("input"));
        expect(link.toString()).toBe("<a>");
        expect(input.toString()).toBe("<input>");
    });
});
