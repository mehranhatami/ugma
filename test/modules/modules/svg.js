describe("svg", function() {
    "use strict";

    it("should return false if not a SVG document", function() {
        expect(ugma.isSVG(ugma.render("div")[0])).toBe(false);
    });

    describe("svg attributes", function() {

        var svg;

        beforeEach(function() {
            jasmine.sandbox.set("<svg width='500' height='100'>" +
                "<rect id='rect1' x='10' y='10' width='50' height='80'" +
                "style='stroke:#000000; fill:none;'/>" +
                "</svg>");

            svg = ugma.query("#rect1");

        });

        it("should handle SVG attributes", function() {

            svg.set("width", "100");
            expect(svg.get("width")).toBe(100);

            svg.set("height", "100");
            expect(svg.get("height")).toBe(100);

        });

        it("should handle setting a SVG style", function() {

            svg.set("style", "stroke: #ff0000");

            expect(svg.get("style")).toBe("stroke: #ff0000; ");
        });

        it("should handle SVG camelCase", function() {

            svg.set("fontSize", "22%");

            expect(svg.get("fontSize")).toBe("22%");
            expect(svg.get("font-size")).toBe("22%");

            svg.set("font-size", "24%");

            expect(svg.get("fontSize")).toBe("24%");
            expect(svg.get("font-size")).toBe("24%");
        });
    });
});