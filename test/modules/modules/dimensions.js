describe("dimensions", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='#'>test</a>");

        link = ugma.query("#test");
    });

    it("should have width and height calculated based on offset", function() {
        expect(link.width()).toBe(link.offset().width);
        expect(link.height()).toBe(link.offset().height);
    });

    it("should set width and height based on css module", function() {

        link.width(20);
        link.height(120);

        expect(link.css("width")).toBe("20px");
        expect(link.css("height")).toBe("120px");
    });
});