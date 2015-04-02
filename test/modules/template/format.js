describe("format", function() {
    "use strict";

    it("should format a string", function() {
       expect(ugma.format("{0}-{1}", [0, 1])).toBe("0-1");
       expect(ugma.format("{a} and {b}", {
           a: "c",
           b: "d"
       })).toBe("c and d");
       expect(ugma.format("{a} and {b}", {
           a: null,
           b: undefined
       })).toBe("null and undefined");
   });

   it("should not throw errors in some cases", function() {
       expect(function() {
           ugma.format("test {0}", undefined);
       }).not.toThrow();
       expect(function() {
           ugma.format("test {0}", null);
       }).not.toThrow();
       expect(function() {
           ugma.format("test {0}", "090");
       }).not.toThrow();
   });

   it("should accept any argument type", function() {
       expect(ugma.format(undefined)).toBe("undefined");
       expect(ugma.format(null)).toBe("null");
       expect(ugma.format(111)).toBe("111");

       function Foo() {}

       Foo.prototype.toString = function() {
           return "bar";
       };

       expect(ugma.format(new Foo())).toBe("bar");
   });

   it("should deal with array of arguments", function() {

       var data = [{
               author: "Pete Hunt",
               text: "This is one comment"
           }, {
               author: "Jordan Walke",
               text: "This is *another* comment"
           }],
           i = data.length;

       while (i--) {

           expect(ugma.format("foo {author} {text}", data[i])).toBe("foo " + data[i].author + " " + data[i].text);
       }
   });


   it("should accept functions in arg map", function() {
       var functor = function(index) {
           expect(index).toBe(4);

           return "test";
       };

       expect(ugma.format("foo {bar}", {
           bar: functor
       })).toBe("foo test");
   });
});