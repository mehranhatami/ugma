describe("inner", function() {
    "use strict";

    var div, input;

    beforeEach(function() {
        div = ugma.render("div>a+a");
        input = ugma.render("input[value=foo]");
    });

    it("should replace child element(s) from node with provided element", function() {
        expect(div[0].childNodes.length).toBe(2);
        expect(div.inner(ugma.render("b"))).toBe(div);
        expect(div[0].childNodes.length).toBe(1);
        expect(div.child(0)).toHaveTag("b");
    });

    it("should return innerHTML string from node when called with no args", function() {
        expect(div.inner().toLowerCase()).toBe("<a></a><a></a>");
    });

    it("should set value of text input to provided string value", function () {
        expect(input.inner("bar")).toBe(input);
        expect(input).toHaveProp("value", "bar");
    });

     it("should set value of text input to string value of provided element", function () {
         expect(input.inner(ugma.render("div"))).toBe(input);
     });
     
     it("supports array of elements", function() {
        var content = ugma.renderAll("b*5");

        expect(div[0].childNodes.length).toBe(2);
        div.inner(content);
        expect(div[0].childNodes.length).toBe(5);
    });

     
       it("works for empty node", function() {
        var foo = ugma.query("x-foo");

        expect(foo.inner()).toBeUndefined();
        expect(foo.inner("123")).toBe(foo);
     });
});