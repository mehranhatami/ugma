describe("ready", function() {
    "use strict";

    var done1, done2, index = 0;

    ugma.ready(function() {
        done1 = ++index;
    });
    ugma.ready(function() {
        done2 = ++index;
    });

    it("should execute callbacks when ugma is ready", function() {
        expect(done1).toBeTruthy();
        expect(done2).toBeTruthy();
        expect(done1 < done2).toBeTruthy();
    });

    it("should call callback synchronously after DOMContentLoaded", function() {
        var spy = jasmine.createSpy("callback");

        ugma.ready(spy);

        expect(spy).toHaveBeenCalled();
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() {
            ugma.ready(1);
        }).toThrow();
    });
});