describe("core", function() {
    "use strict";

    it("should be a object", function() {
        expect(typeof ugma).toBe("object");
    });

    it("should be nodeType 1 for ugma", function() {
        expect(ugma[0].nodeType).toBe(1);
    });

    it("should have a overloaded toString", function() {
        expect(ugma.toString()).toBe("#document");
        expect(typeof ugma.toString()).toBe("string");        
    });
 });    
