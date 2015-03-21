describe("manipulation", function() {
    "use strict";

    describe("remove", function() {
        var div;

        beforeEach(function() {
            div = ugma.add("div>a+a");
        });

        it("should remove", function() {
            var root = ugma.add("<div><span>abc</span></div>");
            var span = root.query("span");
            expect(span.remove()).toEqual(span);
            expect(root.get()).toEqual("");
        });

        it("should remove element(s) from ugma", function() {
            expect(div.remove()).toBe(div);
            expect(document.getElementById("test")).toBeNull();
            expect(ugma.queryAll(".removable").length).toBe(0);
        });

        it("should check if element has parent", function() {
            expect(div.remove().remove()).toBe(div);
        });
    });

    describe("append", function() {

        it("should append", function() {
            var root = ugma.native(document.createElement("div"));
            expect(root.append("<span>abc</span>")).toEqual(root);
            expect(root[0].innerHTML.toLowerCase()).toEqual("<span>abc</span>");
        });

        it("should append text", function() {
            var root = ugma.native(document.createElement("div"));
            expect(root.append("text")).toEqual(root);
            expect(root[0].innerHTML).toEqual("text");
        });
    });

    describe("prepend", function() {

        it("should prepend to empty", function() {
            var root = ugma.native(document.createElement("div"));
            expect(root.append("<span>abc</span>")).toEqual(root);
            expect(root[0].innerHTML.toLowerCase()).toEqual("<span>abc</span>");
        });

        it("should prepend to content", function() {
            var root = ugma.add("<div>text</div>");
            expect(root.prepend("<span>abc</span>")).toEqual(root);
            expect(root.get().toLowerCase()).toEqual("<span>abc</span>text");
        });
        it("should prepend text to content", function() {
            var root = ugma.add("<div>text</div>");
            expect(root.prepend("abc")).toEqual(root);
            expect(root.get().toLowerCase()).toEqual("abctext");
        });
    });

    describe("after", function() {
        it("should after", function() {
            var root = ugma.add("<div><span></span></div>");
            var span = root.query("span");
            expect(span.after("<i></i><b></b>")).toEqual(span);
            expect(root.get().toLowerCase()).toEqual("<span></span><i></i><b></b>");
        });

        it("should allow taking text", function() {
            var root = ugma.add("<div><span></span></div>");
            var span = root.query("span");
            span.after("abc");
            expect(root.get().toLowerCase()).toEqual("<span></span>abc");
        });
    });

    describe("append, prepend, after, before", function() {
        var checkStrategies = {
                prepend: function(el) {
                    return el.child(0);
                },
                append: function(el) {
                    return el.child(-1);
                },
                after: function(el) {
                    return el.next();
                },
                before: function(el) {
                    return el.prev();
                }
            },
            div;

        beforeEach(function() {
            jasmine.sandbox.set("<div id='test'><a></a></div>");

            div = ugma.query("#test");
        });

        it("should accept html string", function() {
            _forIn(checkStrategies, function(checkMethod, strategy) {
                var arg = createDivHtml(strategy);

                expect(checkMethod(div[strategy](arg))).toHaveClass(strategy);
            });
        });

        it("should accept empty string", function() {
            var link = div.child(0);

            _forIn(checkStrategies, function(checkMethod, strategy) {
                expect(checkMethod(link[strategy](""))).toBeMock();
            });
        });

        it("should trim html string", function() {
            _forIn(checkStrategies, function(checkMethod, strategy) {
                var arg = createDivHtmlWhitespaced(strategy);

                expect(checkMethod(div[strategy](arg))).toHaveClass(strategy);
            });
        });

        it("should accept functor", function() {
            _forIn(checkStrategies, function(checkMethod, strategy) {
                var arg = function() {
                    return createDivHtml(strategy);
                };

                expect(checkMethod(div[strategy](arg))).toHaveClass(strategy);
            });
        });

        it("should accept ugmaElement", function() {
            _forIn(checkStrategies, function(checkMethod, strategy) {
                //var arg = ugma.add(createDiv(strategy));
                var arg = ugma.add(createDivHtml(strategy)),
                    otherDiv = ugma.add("div");

                expect(checkMethod(div[strategy](arg))).toHaveClass(strategy);

                otherDiv.set("<section>This <mark>highlighted</mark>?</section>");

                expect(checkMethod(div[strategy](otherDiv))).toHaveTag("div");
                expect(otherDiv.query("section")).toHaveTag("section");
            });
        });

        it("should accept native DOM elements", function() {
            _forIn(checkStrategies, function(checkMethod, strategy) {
                var arg = createDivHtml(strategy),
                    otherDiv = ugma.add("div");

                expect(checkMethod(div[strategy](arg))).toHaveClass(strategy);

                otherDiv.set("<section>This <mark>highlighted</mark>?</section>");

                expect(checkMethod(div[strategy](otherDiv))).toHaveTag("div");
                expect(otherDiv.query("section")).toHaveTag("section");
            });
        });

        it("should access array of Element", function() {
            var sandbox = ugma.query("#" + jasmine.sandbox.id);

            _forIn(checkStrategies, function(_, strategy) {
                div[strategy](createArray(strategy));

                expect(sandbox.queryAll("." + strategy).length).toBe(2);
            });
        });

        it("should return this", function() {
            _forIn(checkStrategies, function(checkMethod, strategy) {
                var arg = createDivHtml(strategy);

                expect(div[strategy](arg)).toBe(div);
            });
        });

        it("should work properly on detached elements", function() {
            div.remove();

            expect(div.append(createDivHtml("append")).child(-1)).toHaveClass("append");
            expect(div.prepend(createDivHtml("prepend")).child(0)).toHaveClass("prepend");
            expect(div.after(createDivHtml("after")).next()).toBeMock();
            expect(div.before(createDivHtml("before")).prev()).toBeMock();
        });
    });

    describe("replace", function() {
        var div;

        beforeEach(function() {
            jasmine.sandbox.set("<div id='test'><a></a></div>");

            div = ugma.query("#test");
        });

        it("should accept html string", function() {
            expect(div.replaceWith(createDivHtml("replace"))).toBe(div);

            expectToBeReplaced("test", "replace");
        });
    });

    function createDivHtml(className) {
        return "<div class='" + className + "'></div>";
    }

    function createDivHtmlWhitespaced(className) {
        return "   <div class='" + className + "'></div>  ";
    }

    function createArray(className) {
        return ugma.addAll("i.{0}+b.{0}", [className]);
    }

    function expectToBeReplaced(id) {
        expect(document.getElementById(id)).toBeNull();
    }

    function _forIn(obj, callback, thisPtr) {
        for (var prop in obj) {
            callback.call(thisPtr, obj[prop], prop, obj);
        }
    }

});