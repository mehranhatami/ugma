describe("ugma.native", function() {
    "use strict";

    it("should return Element object", function() {
        var node = document.createElement("a"),
            el = ugma.native(node);

        expect(el).toHaveTag("a");
        expect(el._).toBeDefined();
        expect(el[0]).toBe(node);
    });

    it("supports document objects", function() {
        var el = ugma.native(document);

        expect(el[0]).toBe(document.documentElement);
        expect(el).toBe(ugma);
    });

    it("should not accept non-elements", function() {
        var node = document.createTextNode("text"),
            el = ugma.native(node);

        expect(el[0]).not.toBe(node);
    });
});
