describe("get", function() {
    "use strict";

    var link, input, textarea, form;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='test.html' data-attr='val'>get-test</a><form id='get_form' method='post'><input type='email' id='get_input' value='test' readonly='true' tabindex='10'/><textarea id='get_textarea'></textarea></form>");

        link = ugma.query("#test");
        input = ugma.query("#get_input");
        textarea = ugma.query("#get_textarea");
        form = ugma.query("#get_form");
    });

    it("should read an attribute value(s)", function() {
        expect(link.get("id")).toBe("test");
        expect(link.get("data-attr")).toBe("val");
        expect(link.get("tagName")).toBe("A");

        expect(link.get(["id", "data-attr", "tagName"])).toEqual({
            id: "test",
            "data-attr": "val",
            "tagName": "A"
        });

        expect(input.get("type")).toBe("email");
        expect(textarea.get("type")).toBe("textarea");
    });

    it("should try to read property value first", function() {
        expect(link.get("href")).not.toBe("test.html");
        expect(input.get("tabIndex")).toBe(10);
        expect(input.get("form").nodeType).toBe(1);
    });

    it("should throw error if argument is invalid", function() {
        expect(function() { link.get(1); }).toThrow();
        expect(function() { link.get(true); }).toThrow();
        expect(function() { link.get({}); }).toThrow();
        expect(function() { link.get(function() {}); }).toThrow();
    });

    it("should polyfill textContent", function() {
        expect(link.get("textContent")).toBe("get-test");
        expect(form.get("textContent")).toBe("");
    });

    it("should return null if attribute doesn't exist", function() {
        expect(link.get("xxx")).toBeNull();
        expect(link.get("data-test")).toBeNull();
    });

    it("should fix camel cased attributes", function() {
        expect(input.get("readonly")).toBe(true);
        expect(input.get("tabindex")).toBe(10);
    });

    it("should return cssText on accessing style property", function() {
        expect(input.get("style")).toBe("");

        input.css("float", "left");

        expect(input.get("style").trim().toLowerCase().indexOf("float: left")).toBe(0);
    });

    it("should return undefined for empty node", function() {
        expect(ugma.query("some-node").get("attr")).toBeUndefined();
    });
});
