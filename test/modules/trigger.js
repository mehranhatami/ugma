describe("trigger", function() {
    "use strict";

    var input, callback;

    beforeEach(function() {
        jasmine.sandbox.set("<input id='input'/>");

        input = ugma.query("#input");

        callback = jasmine.createSpy("callback");
    });

    it("should trigger event handler", function() {
        var events = ["click", "focus", "blur", "change"], i;

        for (i = 0; i < 3; ++i) {
            input.on(events[i], callback).trigger(events[i]);

            expect(callback.calls.count()).toBe(i + 1);
        }
    });

    it("should trigger native handlers", function() {
        input[0].onclick = callback.and.returnValue(false);

        input.trigger("click");

        expect(callback).toHaveBeenCalled();
    });

    it("should trigger native methods if they exist", function() {
        input.trigger("focus");

        expect(input.matches(":focus")).toBe(true);

        expect(input[0]).toBe(document.activeElement);
    });

    describe("custom events", function() {
        it("should be allowed", function() {
            input.on("my:click", callback).trigger("my:click");

            expect(callback).toHaveBeenCalled();
        });

        it("prepend extra arguments if they exist", function() {
            var data1 = {x: 1, y: 2}, data2 = function() {};

            callback.and.callFake(function(a, b) {
                expect(a).toBe(data1);

                if (callback.calls.count() === 1) {
                    expect(b).toBeUndefined();
                } else {
                    expect(b).toBe(data2);
                }
            });

            input.on("my:click", callback);
            input.trigger("my:click", data1);
            expect(callback.calls.count()).toBe(1);

            input.on("click", callback);
            input.trigger("click", data1, data2);
            expect(callback.calls.count()).toBe(2);
        });

        it("ignore event trigger arguments when event props are specified", function() {
            var spy = jasmine.createSpy("on");

            input.on("my:test", ["target"], spy);
            input.trigger("my:test", 123);

            expect(spy).toHaveBeenCalledWith(input);
        });
    });

    it("should return false if default action was prevented", function() {
        expect(input.trigger("focus")).toBe(true);

        input.on("focus", function() { return false });

        expect(input.trigger("focus")).toBe(false);
    });

    it("should return true for empty node", function() {
        expect(ugma.query("some-node").trigger("click")).toBe(true);
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() { input.trigger(1); }).toThrow();
    });

});