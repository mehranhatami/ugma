describe("core", function() {
    "use strict";

    it("should output <document> as the root node", function() {
        expect(ugma.toString()).toBe('<document>');
    });

    it("should output the codename", function() {
        expect(ugma.codename).toBe('trackira');
    });

    it("should be nodeType 1 for root node", function() {
        expect(ugma[0].nodeType).toBe(1);
    });

    
    });    
