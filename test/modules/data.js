describe("data", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<div id='test'</div>");

        link = ugma.query("#test");
    });

    it("should handle custom data-attributes", function() {
        link.custom({
            "test1": "test1",
            "test2": "test2"
        });
        expect(link).toHaveAttr("data-test1", "test1");
        expect(link).toHaveAttr("data-test2", "test2");
    });

    it("should handle private properties", function() {

        link.data({
            "test1": "test1",
            "test2": "test2"
        });

        expect(link.data("test1")).toBe("test1");
        expect(link.data("test2")).toBe("test2");
    });


    it("shoud be stored in _ object", function() {
        link.custom("test", "yeah");

        expect(link).not.toHaveAttr("_test", "yeah");
        expect(link).not.toHaveProp("_test", "yeah");
    });

    it("should delete custom properties", function() {

        link.data({
            "test1": "test1",
            "test2": "test2"
        });

        link.data("test1", null);

        expect(link.data("test1")).toBe(null);
        expect(link.data("test2")).toBe("test2");
    });

});