describe("shadow", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='context_test'></a>");

        link = ugma.query("#context_test");
    });

    it("executes callback async", function(done) {
        var spy = jasmine.createSpy("callback");

        spy.and.callFake(function() {
            link.shadow("test", spy.and.callFake(done));
            expect(spy.calls.count()).toBe(1);
        });

        link.shadow("test", spy);
        expect(spy).not.toHaveBeenCalled();
    });
});