describe("subscribe", function() {
    var link;

    beforeEach(function() {
        link = ugma.render("<a href=\"url\" title=\"text\"></a>");
    });

    it("should execute callback after the setter call", function(done) {
        var spy1 = jasmine.createSpy("watcher1"),
            spy2 = jasmine.createSpy("watcher2"),
            oldHref = link.get("href");

        expect(link.subscribe("href", spy1)).toBe(link);
        expect(link.subscribe("title", spy2)).toBe(link);

        spy1.and.callFake(function(value, oldValue) {
            expect(value).toBe("url_changed");
            expect(oldValue).toBe(oldHref);

            expect(spy2).not.toHaveBeenCalled();

            link.set("title", "modified");
        });

        spy2.and.callFake(function(value, oldValue) {
            expect(value).toBe("modified");
            expect(oldValue).toBe("text");

            expect(spy1.calls.count()).toBe(1);
            expect(spy2.calls.count()).toBe(1);

            done();
        });

        link.set("href", "url_changed");
    });


    it("should allow to unregister handler", function(done) {
        var spy = jasmine.createSpy("watcher");

        expect(link.subscribe("title", spy)).toBe(link);

        spy.and.callFake(function() {
            expect(link.unsubscribe("title", spy)).toBe(link);

            link.set("title", "modified1");

            setTimeout(function() {
                expect(spy.calls.count()).toBe(1);

                done();
            }, 50);
        });

        link.set("title", "modified");
    });

    it("should work for the value shortcut", function(done) {
        var spy = jasmine.createSpy("watcher"),
            input = ugma.render("input");

        spy.and.callFake(function() {
            expect(spy).toHaveBeenCalledWith("test1", "");

            spy = jasmine.createSpy("watcher");
            spy.and.callFake(function() {
                expect(spy).toHaveBeenCalledWith("test2", "");

                done();
            });

            input.subscribe("value", spy);
            input.set("test2");
        });

        link.subscribe("innerHTML", spy);
        link.set("test1");
    });
});
