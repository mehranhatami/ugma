describe("traversing", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<div><b></b><b></b><i id='first'></i><a id='test'><strong></strong><em></em></a><b></b><i></i><i></i></div>");

        link = ugma.query("#test");
    });

    describe("closest", function() {
        it("should find the the first matching element if selector exists", function() {
            expect(link.closest("body")).toHaveTag("body");
        });

        it("should return direct parent when no selector specified", function() {
            expect(ugma.query("body").closest()).toBe(ugma);
            expect(ugma.closest()[0]).toBeUndefined();
        });
    });

});