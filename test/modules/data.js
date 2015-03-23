describe("data", function() {
    "use strict";

    var input;

    beforeEach(function() {

        jasmine.sandbox.set("<input id='set_input' data-a1='test'/><input id='set_input1'/>");

        input = ugma.query("#set_input");
    });

    it("should only remove the specified value when setting a property name to 'null'", function() {

        input.data("prop1", "value");
        input.data("prop2", "doublevalue");

        expect(input.data("prop1")).toBe("value");
        expect(input.data("prop2")).toBe("doublevalue");

        input.data("prop1", null);

        expect(input.data("prop1")).toBeNull();
        expect(input.data("prop2")).toBe("doublevalue");

        input.data("prop2", null);
    });

    it("should only remove the specified value when setting a property name to 'undefined'", function() {

        input.data("prop1", "value");
        input.data("prop2", "doublevalue");

        expect(input.data("prop1")).toBe("value");
        expect(input.data("prop2")).toBe("doublevalue");

        input.data("prop1", undefined);

        expect(input.data("prop1")).toBeNull();
        expect(input.data("prop2")).toBe("doublevalue");

        input.data("prop2", undefined);
    });


    it("should provide the non-wrapped data calls", function() {
        var node = document.createElement("div"),
            native = ugma.native(node);

        expect(native.data("foo")).toBeNull();

        native.data("foo", "bar");

        expect(native.data("foo")).toBe("bar");
        expect(native.data("foo")).toBe("bar");

        native.data("foo", null);
        expect(native.data("foo")).toBeNull();

    });

    it("shoud be stored in _ object", function() {
        input.data("test", "yeah");

        expect(input).not.toHaveAttr("test", "yeah");
        expect(input).not.toHaveProp("test", "yeah");
    });

    it("should accept any kind of object", function() {
        var obj = {},
            nmb = 123,
            arr = [],
            func = function() {},
            tym = new Date(),
            regEx = /test/;

        expect(input.data("obj", obj).data("obj")).toEqual(obj);
        expect(input.data("nmb", nmb).data("nmb")).toEqual(nmb);
        expect(input.data("arr", arr).data("arr")).toEqual(arr);
        expect(input.data("func", func).data("func")).toEqual(func);
        expect(input.data("tym", tym).data("tym")).toEqual(tym);
        expect(input.data("regEx", regEx).data("regEx")).toEqual(regEx);
    });

    it("should accept object argument", function() {
        var param = {
            a: "b",
            c: 1
        };

        input.data(param);

        expect(input.data("a")).toBe("b");
        expect(input.data("c")).toBe(1);
    });

    it("shoud be stored in _ object", function() {
        input.data("test", "yeah");

        expect(input).not.toHaveAttr("test", "yeah");
        expect(input).not.toHaveProp("test", "yeah");
    });

    it("should return reference to 'this' when called with 2 arguments", function() {
        expect(input.data("a1", 123)).toEqual(input);
    });

    it("should add and remove data on SVGs", function() {
        expect(ugma.add("<svg><rect></rect></svg>").data("svg-level", 1).data("svg-level")).toEqual(1);
    });
});