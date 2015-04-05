   describe("contains", function() {
       "use strict";

       var node;

       beforeEach(function() {
           jasmine.sandbox.set("<div id='test'><a></a><a></a></div>");

           node = ugma.query("#test");
       });

       it("should accept a DOM element", function() {
           expect(node.contains(node.query("a"))).toBeTruthy();
       });

       it("should return zero for node itself", function() {
           expect(node.contains(node)).toBe(0);
       });

       it("should throw error if the first argument is not a DOM node", function() {
           expect(function() {
               node.contains(2);
           }).toThrow();
       });

       it("should return false for empty node", function() {
           expect(ugma.query("some-node").contains(ugma)).toBe(false);
       });
   });