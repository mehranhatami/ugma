describe("core", function() {
    "use strict";

    it("should be a object", function() {
        expect(typeof ugma).toBe('object');
    });

    it("should be nodeType 1 for root node", function() {
        expect(ugma[0].nodeType).toBe(1);
    });

    it("should have a overloaded toString", function() {
        expect(ugma.toString()).toBe('<document>');
        expect(typeof ugma.toString()).toBe('string');        
    });

    it("should output the version number", function() {
        expect(ugma.version).toBe('0.0.1');
        expect(typeof ugma.version).toBe('string');        
    });

    it("should output the codename", function() {
        expect(ugma.codename).toBe('trackira');
        expect(typeof ugma.codename).toBe('string');        
    });
 });    
