describe("children", function() {
    "use strict";

    var link;

    beforeEach(function() {

        jasmine.sandbox.set("<div><b></b><b></b><i></i><a id='test'><strong></strong><em></em></a><b></b><i></i><i></i></div>");

        link = ugma.query("#test");
    });

    it("should accept optional filter", function() {
        expect(link.child(0)).toHaveTag("strong");
    });

    it("should throw error if the first arg is not a number", function() {
        expect(function() {
            link.child({});
        }).toThrow();
    });

    it("should read all children elements", function() {
        var select = ugma.render("<select name='n6'><option value='v6'></option><option value='v66' selected></option></select>");

        expect(select.children().length).toBe(2);
    });

    it("should allow to filter children by selector", function() {
        var list = ugma.render("ul>li*3");

        expect(list.children().length).toBe(3);
        expect(list.children("a").length).toBe(0);
        expect(list.children("li").length).toBe(3);
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() {
            link.children({});
        }).toThrow();
        expect(function() {
            link.children(function() {});
        }).toThrow();
    });
});