 describe("closest", function() {
     "use strict";

     var link;

     beforeEach(function() {
         jasmine.sandbox.set("<div><b></b><b></b><i id='first'></i><a id='test'><strong></strong><em></em></a><b></b><i></i><i></i></div>");

         link = ugma.query("#test");
     });

     it("should return closest parent or an empty set when no parent", function() {
         var parent = ugma.render("<div><p>abc</p></div>"),
             child = parent.query("p");

         expect(parent.closest()).toBeTruthy();
         expect(child.closest()[0]).toBe(parent[0]);
     });

     it("should return empty set when no parent", function() {
         var element = ugma.render("<div>abc</div>");
         expect(element.closest()).toBeTruthy();
     });

     it("should find the the first matching element if selector exists", function() {
         expect(link.closest("body")).toHaveTag("body");
     });

     it("should return direct parent when no selector specified", function() {
         expect(ugma.query("body").closest()).toBe(ugma);
         expect(ugma.closest()[0]).toBeUndefined();
     });
 });