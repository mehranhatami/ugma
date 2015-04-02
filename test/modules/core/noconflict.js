describe("ugma.noConflict", function() {
    "use strict";

    beforeEach(function() {
        this.currentugma = window.ugma;
    });

    afterEach(function() {
        window.ugma = this.currentugma;
    });

    it("should not touch ugma", function() {
        expect(ugma).toBe(this.currentugma);
    });

    it("should let noConflict() return ugma", function() {
        expect(ugma).toBe(ugma.noConflict());
    });


    it("should revert to the previous state", function() {
        expect(this.currentugma.noConflict()).toBe(this.currentugma);
        expect(window.ugma).toBeUndefined();
    });

    it("should not touch changed state", function() {
        var otherugma = {};

        window.ugma = otherugma;

        expect(this.currentugma.noConflict()).toBe(this.currentugma);
        expect(window.ugma).toBe(otherugma);
    });
});