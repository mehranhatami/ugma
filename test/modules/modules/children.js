describe("children", function() {
    "use strict";

      var link;
      
    beforeEach(function() {

       jasmine.sandbox.set("<div><b></b><b></b><i></i><a id='test'><strong></strong><em></em></a><b></b><i></i><i></i></div>");

        link = ugma.query("#test");

    });
    
     describe("child", function() {

        it("should accept optional filter", function() {
            expect(link.child(0)).toHaveTag("strong");
        });

        it("should throw error if the first arg is not a number", function() {
            expect(function() { link.child({}); }).toThrow();
        });

    });
});
