describe("traversing", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<div><b></b><b></b><i id='first'></i><a id='test'><strong></strong><em></em></a><b></b><i></i><i></i></div>");

        link = ugma.query("#test");
    });

    describe("next, prev", function() {
        it("should return an appropriate element", function() {
            var expectedResults = {
                next: "b",
                prev: "i"
            };

            _forIn(expectedResults, function(tagName, methodName) {
                expect(link[methodName]()).toHaveTag(tagName);
            });
        });

        it("should search for the first matching element if selector exists", function() {
            expect(link.next("i")).toHaveTag("i");
            expect(link.prev("b")).toHaveTag("b");
            expect(link.last("em")).toHaveTag("em");
            expect(link.closest("body")).toHaveTag("body");
        });
    });

    it("should return empty element if value is not found", function() {
        var unknownEl = link.query("unknown");

        expect(unknownEl.next()[0]).toBeUndefined();
        expect(unknownEl.prev()[0]).toBeUndefined();
        expect(unknownEl.child(0)[0]).toBeUndefined();
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() {
            link.child({});
        }).toThrow();
        expect(function() {
            link.child(function() {});
        }).toThrow();
        expect(function() {
            link.next({});
        }).toThrow();
        expect(function() {
            link.prev(function() {});
        }).toThrow();
    });

    describe("next", function() {
        it("should return next sibling", function() {
            var element = ugma.add("<div><b>b</b><i>i</i></div>");
            var b = element.query("b");
            var i = element.query("i");
            expect(b.next()).toEqual(i);
        });

    });

    describe("children, nextAll, prevAll", function() {
        it("should return an appropriate collection of elements", function() {
            var expectedResults = {
                    children: "strong em".split(" "),
                    nextAll: "b i i".split(" "),
                    prevAll: "i b b".split(" ")
                },
                isOK = function(methodName) {
                    return function(el, index) {
                        expect(el).toHaveTag(expectedResults[methodName][index]);
                    };
                };

            _forIn(expectedResults, function(tagName, methodName) {
                for (var arr = link[methodName](), i = 0, n = arr.length; i < n; ++i) {
                    isOK(arr[i]);
                }
            });
        });

        it("should filter matching elements by optional selector", function() {
            var filters = {
                    children: "em",
                    nextAll: "i",
                    prevAll: "i"
                },
                haveTag = function(tagName) {
                    return function(el) {
                        expect(el).toHaveTag(tagName);
                    };
                };

            _forIn(filters, function(tagName, methodName) {
                for (var arr = link[methodName](tagName), i = 0, n = arr.length; i < n; ++i) {
                    haveTag(tagName);
                }
            });
        });

        it("should return empty element if value is not found", function() {
            var unknownEl = link.query("unknown");

            expect(unknownEl.nextAll().length).toBe(0);
            expect(unknownEl.prevAll().length).toBe(0);
            expect(unknownEl.children().length).toBe(0);
        });

        it("should throw error if arguments are invalid", function() {
            expect(function() {
                link.children({});
            }).toThrow();
            expect(function() {
                link.children(function() {});
            }).toThrow();
            expect(function() {
                link.nextAll({});
            }).toThrow();
            expect(function() {
                link.prevAll(function() {});
            }).toThrow();
        });
    });

    function _forIn(obj, callback, thisPtr) {
        for (var prop in obj) {
            callback.call(thisPtr, obj[prop], prop, obj);
        }
    }

});