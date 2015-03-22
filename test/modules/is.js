describe("is", function() {
    "use strict";

    var link, input;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='is1' href='#matches' class='test1'><i></i></a><input type='checkbox' id='is2' required checked>");

        link = ugma.query("#is1");
        input = ugma.query("#is2");
    });

    it("should work on disconnected nodes - #1", function() {
        expect(ugma.add("div").is("div")).toBe(true);
    });
    
    it("should work on disconnected nodes - #2", function() {
        // unselected option
        expect(link.append(ugma.add("option").set("value", "fooBar")).is(":selected")).toBe(false);
      
        ugma.query("option").set("selected", true);
        
        // selected option
        expect(ugma.query("option").is(":selected")).toBe(true);
    });
    
    it("should work with objects", function() {
        expect(ugma.query("#is1").is( ugma.query("li"))).toBe(true);
    });
   
    it("should match element by a simple selector", function() {
        expect(link.is("a")).toBe(true);
        expect(link.is("#is1")).toBe(true);
        expect(link.is("[href]")).toBe(true);
        expect(link.is(".test1")).toBe(true);
        expect(link.is("a.test1")).toBe(true);
        expect(link.is("a[href]")).toBe(true);
        expect(link.is("a#is1")).toBe(true);
        expect(link.is("div")).toBe(false);

        expect(input.is("[required]")).toBe(true);
        expect(input.is("[unknown]")).toBe(false);
        expect(input.is("[checked]")).toBe(true);
        expect(input.is("[type=checkbox]")).toBe(true);
    });

    it("should match element by a complex selector", function() {
        expect(link.is("a[href='#matches']")).toBe(true);
        expect(link.is("div a")).toBe(true);
    });

    it("should throw error if the argument is ommited or not a string", function() {
        expect(function() { link.is(); }).toThrow();
        expect(function() { link.is(1); }).toThrow();
    });


});
