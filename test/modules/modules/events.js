describe("events", function() {

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

        it("should set event.target on IE", function() {
            var elm = ugma.render("a");
            elm.on("click", ["target"], function(target) {
                expect(target).toBe(elm);
            });
            elm.fire("click");

        });


        it("should return reference to 'this'", function() {
            expect(input.on("click", spy)).toEqual(input);
        });

        it("should debounce mousemove", function(done) {
            var spy = jasmine.createSpy("callback");

            form.on("mousemove", spy);
            form.fire("mousemove");
            form.fire("mousemove");
            form.fire("mousemove");

            setTimeout(function() {
                expect(spy.calls.count()).toBe(1);

                done();
            }, 100);
        });

        it("should debounce scroll", function(done) {
            var spy = jasmine.createSpy("callback");

            form.on("scroll", spy);
            form.fire("scroll");
            form.fire("scroll");
            form.fire("scroll");

            setTimeout(function() {
                expect(spy.calls.count()).toBe(1);

                done();
            }, 100);
        });

        it("should debounce mousewheel", function(done) {
            var spy = jasmine.createSpy("callback");

            form.on("mousewheel", spy);
            form.fire("mousewheel");
            form.fire("mousewheel");
            form.fire("mousewheel");

            setTimeout(function() {
                expect(spy.calls.count()).toBe(1);

                done();
            }, 100);
        });

        it("should debounce touchmove", function(done) {
            var spy = jasmine.createSpy("callback");

            form.on("touchmove", spy);
            form.fire("touchmove");
            form.fire("touchmove");
            form.fire("touchmove");

            setTimeout(function() {
                expect(spy.calls.count()).toBe(1);

                done();
            }, 100);
        });

        it("should accept single callback with the element as 'this' by default", function() {
            input.on("focus", spy).fire("focus");

            spy.and.callFake(function() {
                expect(this).toEqual(input);
            });

            expect(spy).toHaveBeenCalled();
        });

        it("should accept optional event filter", function() {
            ugma.once("focus", "input", spy);

            link.fire("focus");
            expect(spy).not.toHaveBeenCalled();

            input.fire("focus");
            expect(spy).toHaveBeenCalled();
        });

        it("should fix currentTarget when selector exists", function() {
            spy.and.callFake(function(currentTarget) {
                expect(currentTarget).toHaveTag("a");

                return false;
            });

            ugma.once("click", "a", ["currentTarget"], spy);
            link.query("i").fire("click");
            expect(spy).toHaveBeenCalled();
        });

        it("should accept array or key-value object", function() {
            var otherSpy = jasmine.createSpy("otherSpy"),
                arraySpy = jasmine.createSpy("arraySpy");

            input.on({
                focus: spy,
                click: otherSpy
            });

            input.fire("focus");
            expect(spy).toHaveBeenCalled();

            input.fire("click");
            expect(otherSpy).toHaveBeenCalled();

            input.on(["focus", "click"], arraySpy);

            input.fire("focus");
            input.fire("click");
            expect(arraySpy.calls.count()).toBe(2);
        });

        it("should prevent default if handler returns false", function() {
            spy.and.returnValue(false);

            link.on("click", spy).fire("click");
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

                input.on("click", ["target", "currentTarget", "relatedTarget"], spy).fire("click");
                expect(spy).toHaveBeenCalled();

                spy.and.callFake(function(type, defaultPrevented, shiftKey) {
                    expect(type).toBe("focus");
                    expect(defaultPrevented).toBe(false);
                    expect(shiftKey).toBeFalsy();
                });

                input.on("focus", ["type", "defaultPrevented", "shiftKey"], spy).fire("focus");
                expect(spy).toHaveBeenCalled();
            });

            it("handle numbers as event argument index", function() {
                input.on("my:test", [1, 3, "target"], spy);
                input.fire("my:test", 123, 555, "testing");

                expect(spy).toHaveBeenCalledWith(123, "testing", input);
            });

            it("can use zero to access event type", function() {
                input.on("focus", [0, "target"], spy);
                input.fire("focus");

                expect(spy).toHaveBeenCalledWith("focus", input);
            });

            it("may return preventDefault functor", function() {
                spy.and.callFake(function(cancel) {
                    expect(typeof cancel).toBe("function");

                    cancel();
                });

                link.on("click", ["preventDefault"], spy).fire("click");
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
                link.on("click", ["stopPropagation"], spy).fire("click");
                expect(spy).toHaveBeenCalled();
                expect(parentSpy).not.toHaveBeenCalled();
            });
        });

        it("should fix non-bubbling events", function() {
            ugma.once("focus", spy);
            input.fire("focus");
            expect(spy).toHaveBeenCalled();

            ugma.once("invalid", spy);
            input.fire("invalid");
            expect(spy.calls.count()).toBe(2);
        });

        it("should fix input event", function() {
            input.on("input", spy).fire("input");
            expect(spy).toHaveBeenCalled();

            ugma.on("input", "a", spy);
            input.fire("input");
            expect(spy.calls.count()).toBe(2);

            ugma.on("input", "input", spy);
            input.fire("input");
            expect(spy.calls.count()).toBe(4);
        });

        it("should fix submit event", function() {
            spy.and.returnValue(false);

            form.on("submit", spy).fire("submit");
            expect(spy).toHaveBeenCalled();

            ugma.on("submit", "a", spy);
            form.fire("submit");
            expect(spy.calls.count()).toBe(2);

            ugma.on("submit", "form", spy);
            form.fire("submit");
            expect(spy.calls.count()).toBe(4);
        });

        it("should fix reset event", function() {
            form.on("reset", spy).fire("reset");
            expect(spy.calls.count()).toBe(1);

            ugma.on("reset", spy);
            form.fire("reset");
            expect(spy.calls.count()).toBe(3);
        });

        it("should allow to prevent custom events", function() {
            var spy2 = jasmine.createSpy("spy2");

            form.on("custom:on", ["defaultPrevented"], spy);
            input.on("custom:on", spy2.and.returnValue(false));

            spy.and.callFake(function(defaultPrevented) {
                expect(defaultPrevented).toBe(true);
            });

            input.fire("custom:on");
            expect(spy).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });

        it("should handle global ugma as target", function() {
            var spy = jasmine.createSpy("callback");

            ugma.once("custom:event1", ["target", "defaultPrevented"], spy);

            ugma.fire("custom:event1");

            var args = spy.calls.allArgs()[0];

            expect(args[0]).toBe(ugma);
            expect(args[1]).toBe(false);

            spy.calls.reset();
            ugma.once("custom:event2", "ul > li", spy);
            ugma.fire("custom:event2");
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

                input.once("focus", spy).fire("focus");
                expect(spy).toHaveBeenCalled();

                input.fire("focus");
                expect(spy.calls.count()).toBe(1);
            });

        });
    });

   describe("once", function() {
        "use strict";

        var link, input, form, spy;

        beforeEach(function() {
            jasmine.sandbox.set("<a id='once_test' href='#once_test'>test element</a><form id='once_form'><input id='once_input' required='required'/></form>");

            link = ugma.query("#once_test");
            input = ugma.query("#once_input");
            form = ugma.query("#once_form");

            spy = jasmine.createSpy("callback");
        });

        it("should return reference to 'this'", function() {
            expect(input.once("click", spy)).toEqual(input);
        });
    });

    describe("off", function() {
        "use strict";

        var input, link, obj = {
                test: function() {},
                test2: function() {}
            },
            spy;

        beforeEach(function() {
            jasmine.sandbox.set("<a id='link'><input id='input'></a>");

            input = ugma.query("#input");
            link = ugma.query("#link");

            spy = jasmine.createSpy("click");
        });

        it("should do nothing when no listener was registered with bound", function() {
            link.off("click");
            link.off("click", function() {});
        });

        it("should do nothing when a specific listener was not registered", function() {
            link.on("click", function() {});

            link.off("mouseenter", function() {});
        });

        it("should remove event callback", function() {
            input.on("click", spy).off("click", null).fire("click");
            expect(spy).not.toHaveBeenCalled();

            input.on("click", spy).off("click", spy).fire("click");
            expect(spy).not.toHaveBeenCalled();

            input.on("click", "a", spy).off("click", "a", spy).fire("click");
            expect(spy).not.toHaveBeenCalled();
        });

        it("supports selector argument", function() {
            link.on("click", spy).on("click", "input", spy);
            input.fire("click");
            expect(spy.calls.count()).toBe(2);

            link.off("click", "input", spy);
            input.fire("click");
            expect(spy.calls.count()).toBe(3);
        });

        it("should remove all event handlers if called without the second argument", function() {
            spyOn(obj, "test");
            spyOn(obj, "test2");

            link.on("click", obj.test).on("click", obj.test2).off("click");
            input.fire("click");

            expect(obj.test).not.toHaveBeenCalled();
            expect(obj.test2).not.toHaveBeenCalled();
        });

        it("should throw error if agruments are invalid", function() {
            expect(function() {
                link.off(123);
            }).toThrow();
        });

    });

    describe("fire", function() {
        "use strict";

        var input, callback;

        beforeEach(function() {
            jasmine.sandbox.set("<input id='input'/>");

            input = ugma.query("#input");

            callback = jasmine.createSpy("callback");
        });

        it("should fire event handler", function() {
            var events = ["click", "focus", "blur", "change"],
                i;

            for (i = 0; i < 3; ++i) {
                input.on(events[i], callback).fire(events[i]);

                expect(callback.calls.count()).toBe(i + 1);
            }
        });

        it("should trigger native handlers", function() {
            input[0].onclick = callback.and.returnValue(false);

            input.fire("click");

            expect(callback).toHaveBeenCalled();
        });

        it("should trigger native methods if they exist", function() {
            input.fire("focus");

            expect(input.matches(":focus")).toBe(true);

            expect(input[0]).toBe(document.activeElement);
        });

        describe("custom events", function() {
            it("should be allowed", function() {
                input.on("my:click", callback).fire("my:click");

                expect(callback).toHaveBeenCalled();
            });

            it("prepend extra arguments if they exist", function() {
                var data1 = {
                        x: 1,
                        y: 2
                    },
                    data2 = function() {};

                callback.and.callFake(function(a, b) {
                    expect(a).toBe(data1);

                    if (callback.calls.count() === 1) {
                        expect(b).toBeUndefined();
                    } else {
                        expect(b).toBe(data2);
                    }
                });

                input.on("my:click", callback);
                input.fire("my:click", data1);
                expect(callback.calls.count()).toBe(1);

                input.on("click", callback);
                input.fire("click", data1, data2);
                expect(callback.calls.count()).toBe(2);
            });

            it("ignore event trigger arguments when event props are specified", function() {
                var spy = jasmine.createSpy("on");

                input.on("my:test", ["target"], spy);
                input.fire("my:test", 123);

                expect(spy).toHaveBeenCalledWith(input);
            });
        });

        it("should return false if default action was prevented", function() {
            expect(input.fire("focus")).toBe(true);

            input.on("focus", function() {
                return false;
            });

            expect(input.fire("focus")).toBe(false);
        });

        it("should return true for empty node", function() {
            expect(ugma.query("some-node").fire("click")).toBe(true);
        });

        it("should throw error if arguments are invalid", function() {
            expect(function() {
                input.fire(1);
            }).toThrow();
        });

    });

});