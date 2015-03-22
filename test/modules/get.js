describe("get", function() {
    "use strict";

    var link, input, textarea, form, checkbox, option, txt, tabIndex;

    beforeEach(function() {
        jasmine.sandbox.set("<div id='tabindex'>I should...</div><input id='txt' type='text'/><option id='option'><option/><input id='chkbox' type='checkbox'/><a id='test' href='test.html' data-attr='val'>get-test</a><form id='get_form' method='post'><input type='email' id='get_input' value='test' readonly='true' tabindex='10'/><textarea id='get_textarea'></textarea></form>");

        link = ugma.query("#test");
        input = ugma.query("#get_input");
        textarea = ugma.query("#get_textarea");
        form = ugma.query("#get_form");
        checkbox = ugma.query("#chkbox");
        option = ugma.query("#option");
        txt = ugma.query("#txt");
        tabIndex = ugma.query("#tabindex");
    });

    it("should return a CSS string representing the Element's styles", function() {
        var style = "font-size:12px;color:rgb(255,255,255)";
        var myElement = ugma.add("div").set("style", style);
        expect(myElement.get("style").toLowerCase().replace(/\s/g, "").replace(/;$/, "")).toMatch(/(font-size:12px;color:rgb\(255,255,255\))|(color:rgb\(255,255,255\);font-size:12px)/);
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

    it("should use 'innerHTML' or 'value' if name argument is undefined", function() {
        expect(link.get()).toBe("get-test");
        expect(input.get()).toBe("test");
    });

    it("should return the nodes's tagName", function() {
        var myElement = ugma.add("div");
        expect(myElement.get("tagName")).toEqual("DIV");
    });

    it("should try to read property value first", function() {
        expect(link.get("href")).not.toBe("test.html");
        expect(input.get("tabIndex")).toBe(10);
        expect(input.get("form").nodeType).toBe(1);
    });

    it("should get an absolute href", function() {
        var link = ugma.add("a").set({
            href: "http://google.com/"
        });
        expect(link.get("href")).toEqual("http://google.com/");
    });

    it("should get an absolute href to the same domain", function() {
        var link = ugma.add("a").set({
            href: window.location.href
        });
        expect(link.get("href")).toEqual(window.location.href);
    });

    it("should return '' when attribute is missing", function() {
        var link = ugma.add("a");
        expect(link.get("href")).toBe("");
    });


    it("should read boolean values", function() {

        checkbox.set("checked", true);

        expect(checkbox.get("checked")).toBe(true);
        expect(checkbox[0].checked).toBe(true);

        option.set("selected", true);

        expect(option.get("selected")).toBe(true);
        expect(option[0].selected).toBe(true);

    });

    it("should handle HTML5 boolean attributes", function() {
        txt.set({
            "autofocus": true,
            "required": true
        });

        expect(txt.get("autofocus")).toBe(true);
        expect(txt.set("autofocus", false).get("autofocus")).toBe(false);

        expect(txt.get("required")).toBe(true);
        expect(txt.set("required", false).get("required")).toBe(false);
    });

    it("should return undefined for non-existing attributes on input", function() {
        var elm = ugma.add("input");
        expect(elm.get("readonly")).toBeFalsy();
        expect(elm.get("readOnly")).toBeFalsy();
        expect(elm.get("disabled")).toBeFalsy();
    });

    it("should read element property", function() {
        var elm = ugma.add("<div class='foo'>a</div>");
        expect(elm.get("className")).toBe("foo");
    });

    it("should set element property to a value", function() {
        var elm = ugma.add("<div class='foo'>a</div>");
        elm.set("className", "bar");
        expect(elm[0].className).toBe("bar");
        expect(elm.get("className")).toBe("bar");
    });

    it("should throw error if argument is invalid", function() {
        expect(function() {
            link.get(1);
        }).toThrow();
        expect(function() {
            link.get(true);
        }).toThrow();
        expect(function() {
            link.get({});
        }).toThrow();
        expect(function() {
            link.get(function() {});
        }).toThrow();
    });

    it("should polyfill textContent", function() {
        expect(link.get("textContent")).toBe("get-test");
        expect(form.get("textContent")).toBe("");
    });


    it("should handle tabIndex", function() {

        expect(tabIndex.get("tabindex")).toBe(-1);

        tabIndex.set("tabindex", "1");

        expect(tabIndex.get("tabindex")).toBe(1);

        tabIndex.set("tabindex", "0");

        expect(tabIndex.get("tabindex")).toBe(0);

        tabIndex.set("tabindex", "-1");

        expect(tabIndex.get("tabindex")).toBe(-1);

        tabIndex.set("tabindex", "1");

        expect(tabIndex.get("tabindex")).toBe(1);

        tabIndex.set("tabindex", "0");

        expect(tabIndex.get("tabindex")).toBe(0);

        tabIndex.set("tabindex", "-1");

        expect(tabIndex.get("tabindex")).toBe(-1);

        tabIndex.set("tabindex", "5");

        expect(tabIndex.get("tabindex")).toBe(5);
    });

    it("handles select as undefined key", function() {
        var select = ugma.add("<select><option>a2</option><option>a3</option></select>");
        expect(select.get()).toBe("a2");

        select = ugma.add("<select><option>a2</option><option selected>a3</option></select>");
        expect(select.get()).toBe("a3");

        select.set("selectedIndex", -1);
        expect(select.get()).toBe("");
    });

    it("handles select as defined key", function() {
        var select = ugma.add("<select><option>a2</option><option>a3</option></select>");
        expect(select.get("select")).toBe("a2");

        select = ugma.add("<select><option>a2</option><option selected>a3</option></select>");
        expect(select.get("select")).toBe("a3");

        select.set("selectedIndex", -1);
        expect(select.get("select")).toBe("");
    });

    it("handles option as undefined key", function() {
        var select = ugma.add("<select><option value='a1'>a2</option><option selected>a3</option></select>");
        expect(select.child(0).get()).toBe("a1");
        expect(select.child(1).get()).toBe("a3");
    });

    it("handles option as defined key", function() {
        var select = ugma.add("<select><option value='a1'>a2</option><option selected>a3</option></select>");
        expect(select.child(0).get("option")).toBe("a1");
        expect(select.child(1).get("option")).toBe("a3");
    });

    it("handles different tags", function() {
        var div = ugma.add("div>a+a"),
            input = ugma.add("input[value=foo]");

        expect(div.value().toLowerCase()).toBe("<a></a><a></a>");
        expect(input.get()).toBe("foo");
    });
    it("handles textarea", function() {
        var textarea = ugma.add("textarea");

        expect(textarea.get()).toBe("");
        textarea.set("value", "123");
        expect(textarea.get()).toBe("123");
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

    it("should normalize the case of boolean attributes", function() {
        var elm = ugma.add("input");
        expect(elm.get("readonly")).toBeFalsy();
        expect(elm.get("readOnly")).toBeFalsy();
        expect(elm.get("disabled")).toBeFalsy();
    });

    it("should return undefined for empty node", function() {
        expect(ugma.query("some-node").get("attr")).toBeUndefined();
    });

    describe("private properties", function() {
        beforeEach(function() {
            input = ugma.add("<input data-a1=\"x\" data-a2='{\"a\":\"b\",\"c\":1,\"d\":null}' data-a3=\"1=2=3\" data-a4=\"/url?q=:q\" data-camel-cased=\"test\" data-a101-value=\"numbered\"/>");
        });

        it("should read an appropriate data-* attribute if it exists", function() {
            expect(input.get("_a1")).toEqual("x");
            expect(input.get("_a2")).toEqual({
                a: "b",
                c: 1,
                d: null
            });
            expect(input.get("_a3")).toBe("1=2=3");
            expect(input.get("_a4")).toBe("/url?q=:q");
            expect(input.get("_a5")).toBeNull();
        });

        it("should handle camel case syntax", function() {
            expect(input.get("_camelCased")).toBe("test");
            expect(input._.camelCased).toBe("test");

            expect(input.get("_a101Value")).toBe("numbered");
            expect(input._.a101Value).toBe("numbered");
        });
    });

    describe("values", function() {
        it("should read, write value", function() {
            var input = ugma.add("<input type='text'/>");
            expect(input.set("value", "abc")).toEqual(input);
            expect(input[0].value).toEqual("abc");
            expect(input.get("value")).toEqual("abc");
        });
    });
});