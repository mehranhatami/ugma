describe("dimensions", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<div id='test' style='width:20px;height:20px;'>test</div>");

        link = ugma.query("#test");
    });

    it("should get width", function() {
        expect(link.width()).toBe(20);
    });

    it("should get height", function() {
        expect(link.height()).toBe(20);
    });

    it("should set width and height", function() {

        link.width(29);
        expect(link.width()).toBe(29);
        link.height(29);
        expect(link.height()).toBe(29);
        link.width(100);
        expect(link.width()).toBe(100);
        link.height(100);
        expect(link.height()).toBe(100);

    });
    
       
     it("should return nothing on disconnected node", function() {
        expect(ugma.native( document.createElement("div") ).width()).not.toBeDefined();
        expect(ugma.native( document.createElement("div") ).height()).not.toBeDefined();
    });
   

 it("should set width and height on hidden div", function() {

        link.css("visible", "hidden");
        
        link.width(29);
        expect(link.width()).toBe(29);
        link.height(29);
        expect(link.height()).toBe(29);
        link.width(100);
        expect(link.width()).toBe(100);
        link.height(100);
        expect(link.height()).toBe(100);

    });

});