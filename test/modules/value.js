describe("value", function() {
    "use strict";

    var div, input;

    beforeEach(function() {
        div = ugma.add("div>a+a");
        input = ugma.add("input[value=foo]");
    });

    it("should replace child element(s) from node with provided element", function() {
        expect(div[0].childNodes.length).toBe(2);
        expect(div.value(ugma.add("b"))).toBe(div);
        expect(div[0].childNodes.length).toBe(1);
        expect(div.child(0)).toHaveTag("b");
    });

    it("should return innerHTML string from node when called with no args", function() {
        expect(div.value().toLowerCase()).toBe("<a></a><a></a>");
    });

    it("should set value of text input to provided string value", function () {
        expect(input.value("bar")).toBe(input);
        expect(input).toHaveProp("value", "bar");
    });

     it("should set value of text input to string value of provided element", function () {
         expect(input.value(ugma.add("div"))).toBe(input);
     });
     
     it("supports array of elements", function() {
        var content = ugma.addAll("b*5");

        expect(div[0].childNodes.length).toBe(2);
        div.value(content);
        expect(div[0].childNodes.length).toBe(5);
    });

     
       it("works for empty node", function() {
        var foo = ugma.query("x-foo");

        expect(foo.value()).toBeUndefined();
        expect(foo.value("123")).toBe(foo);
     });
});