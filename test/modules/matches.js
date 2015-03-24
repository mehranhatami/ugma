describe("matches", function() {
    "use strict";

    var link, input;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='is1' href='#matches' class='test1'><i></i></a><input type='checkbox' id='is2' required checked>");

        link = ugma.query("#is1");
        input = ugma.query("#is2");
    });

    it("should work on disconnected nodes - #1", function() {
        expect(ugma.add("div").matches("div")).toBe(true);
    });
    
    it("should work on disconnected nodes - #2", function() {
        // unselected option
        expect(link.append(ugma.add("option").set("value", "fooBar")).matches(":selected")).toBe(false);
      
        ugma.query("option").set("selected", true);
        
        // selected option
        expect(ugma.query("option").matches(":selected")).toBe(true);
    });
   
    it("should match element by a simple selector", function() {
        expect(link.matches("a")).toBe(true);
        expect(link.matches("#is1")).toBe(true);
        expect(link.matches("[href]")).toBe(true);
        expect(link.matches(".test1")).toBe(true);
        expect(link.matches("a.test1")).toBe(true);
        expect(link.matches("a[href]")).toBe(true);
        expect(link.matches("a#is1")).toBe(true);
        expect(link.matches("div")).toBe(false);

        expect(input.matches("[required]")).toBe(true);
        expect(input.matches("[unknown]")).toBe(false);
        expect(input.matches("[checked]")).toBe(true);
        expect(input.matches("[type=checkbox]")).toBe(true);
    });

    it("should match element by a complex selector", function() {
        expect(link.matches("a[href='#matches']")).toBe(true);
        expect(link.matches("div a")).toBe(true);
    });

    it("should throw error if the argument is ommited or not a string", function() {
        expect(function() { link.matches(); }).toThrow();
        expect(function() { link.matches(1); }).toThrow();
    });

    describe(":visible and :hidden", function() {

        it("should respect CSS property visibility", function() {
            expect(link.matches(":hidden")).toBe(false);

            link.css("visibility", "hidden");
            expect(link.matches(":hidden")).toBe(true);

            link.css("visibility", "visible");
            expect(link.matches(":hidden")).toBe(false);

            link.css("visibility", "inherit");
            expect(link.matches(":hidden")).toBe(false);
        });

        it("should respect CSS property display", function() {
            expect(link.matches(":hidden")).toBe(false);

            link.css("display", "none");
            expect(link.matches(":hidden")).toBe(true);

            link.css("display", "block");
            expect(link.matches(":hidden")).toBe(false);
        });

        it("should support block elements as well", function(done) {
            link.css("display", "block");

            expect(link.matches(":hidden")).toBe(false);
            expect(link.matches(":visible")).toBe(true);

            link.hide(function() {
                expect(link.matches(":hidden")).toBe(true);
                expect(link.matches(":visible")).toBe(false);

                link.show(function() {
                    expect(link.matches(":hidden")).toBe(false);
                    expect(link.matches(":visible")).toBe(true);

                    done();
                });
            });
        });
    });
});
