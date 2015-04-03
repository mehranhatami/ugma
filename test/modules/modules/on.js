describe("on", function() {
    "use strict";

    var link, input, form, spy;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='#test'>test element<i></i></a><form id='form'><input id='input' required='required'/></form>");

        link = ugma.query("#test");
        input = ugma.query("#input");
        form = ugma.query("#form");

        spy = jasmine.createSpy("callback");
    });

    it("should return reference to 'this'", function() {
        expect(input.on("click", spy)).toEqual(input);
    });

 it("should debounce mousemove", function(done) {
        var spy = jasmine.createSpy("callback");

        form.on("mousemove", spy);
        form.trigger("mousemove");
        form.trigger("mousemove");
        form.trigger("mousemove");

        setTimeout(function() {
            expect(spy.calls.count()).toBe(1);

            done();
        }, 100);
    });

 it("should debounce scroll", function(done) {
        var spy = jasmine.createSpy("callback");

        form.on("scroll", spy);
        form.trigger("scroll");
        form.trigger("scroll");
        form.trigger("scroll");

        setTimeout(function() {
            expect(spy.calls.count()).toBe(1);

            done();
        }, 100);
    });

 it("should debounce mousewheel", function(done) {
        var spy = jasmine.createSpy("callback");

        form.on("mousewheel", spy);
        form.trigger("mousewheel");
        form.trigger("mousewheel");
        form.trigger("mousewheel");

        setTimeout(function() {
            expect(spy.calls.count()).toBe(1);

            done();
        }, 100);
    });
    
 it("should debounce touchmove", function(done) {
        var spy = jasmine.createSpy("callback");

        form.on("touchmove", spy);
        form.trigger("touchmove");
        form.trigger("touchmove");
        form.trigger("touchmove");

        setTimeout(function() {
            expect(spy.calls.count()).toBe(1);

            done();
        }, 100);
    });
    
    it("should attach an event handler with a namespaced type to an element", function() {

        var eventType = "focus",
            eventNS = "Ns";

        input.on([eventType, eventNS].join("."), spy).trigger("focus");

        expect(spy).toHaveBeenCalled();
    });

    it("should accept single callback with the element as 'this' by default", function() {
        input.on("focus", spy).trigger("focus");

        spy.and.callFake(function() {
            expect(this).toEqual(input);
        });

        expect(spy).toHaveBeenCalled();
    });

    it("should accept optional event filter", function() {
        ugma.once("focus", "input", spy);

        link.trigger("focus");
        expect(spy).not.toHaveBeenCalled();

        input.trigger("focus");
        expect(spy).toHaveBeenCalled();
    });

    it("should fix currentTarget when selector exists", function() {
        spy.and.callFake(function(currentTarget) {
            expect(currentTarget).toHaveTag("a");

            return false;
        });

        ugma.once("click", "a", ["currentTarget"], spy);
        link.query("i").trigger("click");
        expect(spy).toHaveBeenCalled();
    });

    it("should accept array or key-value object", function() {
        var otherSpy = jasmine.createSpy("otherSpy"),
            arraySpy = jasmine.createSpy("arraySpy");

        input.on({
            focus: spy,
            click: otherSpy
        });

        input.trigger("focus");
        expect(spy).toHaveBeenCalled();

        input.trigger("click");
        expect(otherSpy).toHaveBeenCalled();

        input.on(["focus", "click"], arraySpy);

        input.trigger("focus");
        input.trigger("click");
        expect(arraySpy.calls.count()).toBe(2);
    });

    it("should prevent default if handler returns false", function() {
        spy.and.returnValue(false);

        link.on("click", spy).trigger("click");
        expect(spy).toHaveBeenCalled();
        expect(location.hash).not.toBe("#test");
    });

    describe("handler arguments", function() {
        it("handle strings as the event object property names", function() {
            spy.and.callFake(function(target, currentTarget, relatedTarget) {
                expect(target).toBe(input);
                expect(currentTarget).toBe(input);
                expect(relatedTarget).not.toBeFalsy();
                expect(relatedTarget).toBeMock();
            });

            input.on("click", ["target", "currentTarget", "relatedTarget"], spy).trigger("click");
            expect(spy).toHaveBeenCalled();

            spy.and.callFake(function(type, defaultPrevented, shiftKey) {
                expect(type).toBe("focus");
                expect(defaultPrevented).toBe(false);
                expect(shiftKey).toBeFalsy();
            });

            input.on("focus", ["type", "defaultPrevented", "shiftKey"], spy).trigger("focus");
            expect(spy).toHaveBeenCalled();
        });

        it("handle numbers as event argument index", function() {
            input.on("my:test", [1, 3, "target"], spy);
            input.trigger("my:test", 123, 555, "testing");

            expect(spy).toHaveBeenCalledWith(123, "testing", input);
        });

        it("can use zero to access event type", function() {
            input.on("focus", [0, "target"], spy);
            input.trigger("focus");

            expect(spy).toHaveBeenCalledWith("focus", input);
        });

        it("may return preventDefault functor", function() {
            spy.and.callFake(function(cancel) {
                expect(typeof cancel).toBe("function");

                cancel();
            });

            link.on("click", ["preventDefault"], spy).trigger("click");
            expect(spy).toHaveBeenCalled();
            expect(location.hash).not.toBe("#test");
        });

        it("may return stopPropagation functor", function() {
            var parentSpy = jasmine.createSpy("parent");

            spy.and.callFake(function(stop) {
                expect(typeof stop).toBe("function");

                stop();
            });

            link.closest().on("click", parentSpy);
            link.on("click", ["stopPropagation"], spy).trigger("click");
            expect(spy).toHaveBeenCalled();
            expect(parentSpy).not.toHaveBeenCalled();
        });
    });

    it("should fix non-bubbling events", function() {
        ugma.once("focus", spy);
        input.trigger("focus");
        expect(spy).toHaveBeenCalled();

        ugma.once("invalid", spy);
        input.trigger("invalid");
        expect(spy.calls.count()).toBe(2);
    });

    it("should fix input event", function() {
        input.on("input", spy).trigger("input");
        expect(spy).toHaveBeenCalled();

        ugma.on("input", "a", spy);
        input.trigger("input");
        expect(spy.calls.count()).toBe(2);

        ugma.on("input", "input", spy);
        input.trigger("input");
        expect(spy.calls.count()).toBe(4);
    });

    it("should fix submit event", function() {
        spy.and.returnValue(false);

        form.on("submit", spy).trigger("submit");
        expect(spy).toHaveBeenCalled();

        ugma.on("submit", "a", spy);
        form.trigger("submit");
        expect(spy.calls.count()).toBe(2);

        ugma.on("submit", "form", spy);
        form.trigger("submit");
        expect(spy.calls.count()).toBe(4);
    });

    it("should fix reset event", function() {
        form.on("reset", spy).trigger("reset");
        expect(spy.calls.count()).toBe(1);

        ugma.on("reset", spy);
        form.trigger("reset");
        expect(spy.calls.count()).toBe(3);
    });

    it("should allow to prevent custom events", function() {
        var spy2 = jasmine.createSpy("spy2");

        form.on("custom:on", ["defaultPrevented"], spy);
        input.on("custom:on", spy2.and.returnValue(false));

        spy.and.callFake(function(defaultPrevented) {
            expect(defaultPrevented).toBe(true);
        });

        input.trigger("custom:on");
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it("should handle global ugma as target", function() {
        var spy = jasmine.createSpy("callback");

        ugma.once("custom:event1", ["target", "defaultPrevented"], spy);
        ugma.trigger("custom:event1");

        var args = spy.calls.allArgs()[0];

        expect(args[0]).toBe(ugma);
        expect(args[1]).toBe(false);

        spy.calls.reset();
        ugma.once("custom:event2", "ul > li", spy);
        ugma.trigger("custom:event2");
        expect(spy).not.toHaveBeenCalled();
    });

    it("should do nothing for emapty nodes", function() {
        var el = ugma.query("some-element");

        expect(el.on("click", function() {})).toBe(el);
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() {
            input.on(123);
        }).toThrow();
        expect(function() {
            input.on("a", 123);
        }).toThrow();
    });

    describe("once", function() {
        it("should trigger callback only one time", function() {
            spy.and.callFake(function() {
                expect(this).toBe(input);
            });

            input.once("focus", spy).trigger("focus");
            expect(spy).toHaveBeenCalled();

            input.trigger("focus");
            expect(spy.calls.count()).toBe(1);
        });

    });
});