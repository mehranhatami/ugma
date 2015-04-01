describe("set", function() {
    "use strict";

    var link, input, txt;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>" +
            "<label for='action' id='label-for'>Action:</label>" +
            "<input type='text' name='action' value='Test' id='text1' required='required' maxlength='30'/>" +
            "<input type='text' name='text2' value='Test' id='text2' disabled='disabled'/>" +
            "<input type='radio' name='radio1' id='radio1' value='on'/>" +
            "<input type='radio' name='radio2' id='radio2' checked='checked'/>" +
            "<input type='checkbox' name='check' id='check1' checked='checked'/>" +
            "<input type='checkbox' id='check2' value='on'/>" +
            "<input type='hidden' name='hidden' id='hidden1'/>" +
            "<input type='text' style='display:none;' name'foo[bar]' id='hidden2'/>" +
            "<input type='text' id='name' name='name' value='name' />" +
            "<input type='search' id='search' name='search' value='search' />" +
            "<button id='button' name='button' type='button'>Button</button>" +
            "<textarea id='area1' maxlength='30'>foobar</textarea>" +
            "</form>");

        link = ugma.query("#test");
        input = ugma.query("#set_input");
        txt = ugma.query("#text1");
    });

    it("should set boolean element property", function() {

        var checkbox = ugma.add("<input type='checkbox'>");

        expect(checkbox.get("checked")).toBe(false);

        checkbox.set("checked", true);
        expect(checkbox.get("checked")).toBe(true);

        checkbox.set("checked", "");
        expect(checkbox.get("checked")).toBe(false);

        checkbox.set("checked", "lala");
        expect(checkbox.get("checked")).toBe(true);


        expect(checkbox.set("checked", null)).not.toHaveAttr("checked");
    });

    it("should return reference to 'this'", function() {
        expect(link.set("id", "t")).toBe(link);
    });

    it("should set the class name of an element", function() {
        link.set("class", "some_class");
        expect(link[0].className).toEqual("some_class");
    });

    it("should update an appropriate native object attribute", function() {
        expect(link.set("data-test", "t")).toHaveAttr("data-test", "t");
    });

    it("should try to update an appropriate native object property first", function() {
        link.set("href", "#test");

        expect(link).toHaveAttr("href", "#test");
        expect(link).not.toHaveAttr("href", "#");
    });

    it("should remove attribute if value is null or undefined", function() {
        expect(link.set("id", null)).not.toHaveAttr("id");
        expect(link.set("href", undefined)).not.toHaveAttr("href");
    });

    it("should accept primitive types", function() {
        expect(link.set(1)).toHaveHtml("1");
        expect(link.set(true)).toHaveHtml("true");
    });

    it("should accept function", function() {
        var spy = jasmine.createSpy("setter").and.returnValue("test_changed");

        link.set("id", spy);

        expect(spy).toHaveBeenCalledWith(link);
        expect(link).toHaveAttr("id", "test_changed");
    });

    it("should accept object with key-value pairs", function() {
        link.set({
            "data-test1": "test1",
            "data-test2": "test2"
        });

        expect(link).toHaveAttr("data-test1", "test1");
        expect(link).toHaveAttr("data-test2", "test2");
    });

    it("should accept array of key values", function() {
        link.set(["autocomplete", "autocorrect"], "off");

        expect(link).toHaveAttr("autocomplete", "off");
        expect(link).toHaveAttr("autocorrect", "off");
    });

    it("should polyfill textContent", function() {
        expect(link.get("textContent")).toBe("set-test");
        link.set("textContent", "<i>changed</i>");
        expect(link.get("textContent")).toBe("<i>changed</i>");
        expect(link.get()).toBe("&lt;i&gt;changed&lt;/i&gt;");
    });

    it("should throw error if argument is invalid", function() {
        expect(function() {
            link.set(1, "");
        }).toThrow();
        expect(function() {
            link.set(true, "");
        }).toThrow();
        expect(function() {
            link.set(function() {}, "");
        }).toThrow();
    });

    it("should read/write current page title", function() {
        expect(ugma.get("title")).toBe(document.title);

        expect(ugma.set("title", "abc")).toBe(ugma);
        expect(document.title).toBe("abc");

    });

    it("should access cssText for the style property", function() {
        expect(link).not.toHaveStyle("font-style", "italic");
        expect(link).not.toHaveStyle("float", "left");

        link.set("style", "font-style:italic");

        expect(link.css("font-style")).toBe("italic");
        expect(link.css("float")).not.toBe("left");

        link.set("style", "float:left");

        expect(link.css("font-style")).not.toBe("italic");
        expect(link.css("float")).toBe("left");
    });

    it("should return this for empty nodes", function() {
        var empty = ugma.query("some-node");

        expect(empty.set("attr", "test")).toBe(empty);
    });

    describe("value shortcut", function() {
        it("should use 'innerHTML' or 'value' if name argument is undefined", function() {
            var value = "set-test-changed";

            link.set(value);
            input.set(value);

            expect(link).toHaveHtml(value);
            expect(input).toHaveProp("value", value);
        });

        it("should set select value properly", function() {
            var select = ugma.add("<select><option>AM</option><option>PM</option></select>");

            expect(select.get()).toBe("AM");
            select.set("PM");
            expect(select.get()).toBe("PM");
            select.set("MM");
            expect(select.get()).toBe("");
        });

        it("should set the html of select", function() {
            var html = "<option>option 1</option><option selected='selected'>option 2</option>";

            var select = ugma.add("select").set("innerHTML", html);

            expect(select.children().length).toEqual(2);
            expect(select[0].options.length).toEqual(2);
            expect(select[0].selectedIndex).toEqual(1);
        });

        it("should set the html of table", function() {
            var html = "<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class='cell'>cell 1</td><td>cell 2</td></tr></tbody>";

            var table = ugma.add("table").set("innerHTML", html);

            expect(table.children().length).toEqual(1);
            expect(table.first().first().children().length).toEqual(2);
            expect(table.first().last().first().get("className")).toEqual("cell");
        });

        it("should set the text of an element", function() {
            var div = ugma.add("div").set("textContent", "some text content");
            expect(div.get("textContent")).toEqual("some text content");
            expect(div[0].innerHTML).toEqual("some text content");
        });

        it("should set the style attribute of an element", function() {
            var style = "font-size:12px;line-height:23px;";
            var div = ugma.add("div").set("style", style);
            expect(div[0].style.lineHeight).toEqual("23px");
            expect(div[0].style.fontSize).toEqual("12px");
        });

        it("should set multiple attributes of an element", function() {
            link.set({
                id: "apple",
                "title": "some_title",
                "innerHTML": "some_content"
            });

            expect(link[0].id).toEqual("apple");
            expect(link[0].title).toEqual("some_title");
            expect(link[0].innerHTML).toEqual("some_content");
        });


        it("should set various attributes of a script element", function() {
            link.set({
                type: "text/javascript",
                defer: "defer"
            });
            expect(link[0].type).toEqual("text/javascript");
            expect(link[0].defer).toBeTruthy();
        });

        it("should set various attributes of a table element", function() {
            var table = ugma.add("table").set({
                border: "2",
                cellpadding: "3",
                cellspacing: "4",
                align: "center"
            });
            expect(table.get("border")).toBe("2");
            expect(table.get("cellPadding")).toBe("3");
            expect(table.get("cellSpacing")).toBe("4");
            expect(table[0].align).toEqual("center");
        });

        it("should replace child element(s) from node with provided element", function() {
            var div = ugma.add("div>a+a");
            expect(div[0].childNodes.length).toBe(2);
            expect(div.value(ugma.add("b"))).toBe(div);
            expect(div[0].childNodes.length).toBe(1);
            expect(div.child(0)).toHaveTag("b");
        });

        it("should set value of text input to provided string value", function() {
            var input = ugma.add("input[value=foo]");
            expect(input.value("bar")).toBe(input);
            expect(input).toHaveProp("value", "bar");
        });

        it("should call the function and update the attribute with the return value", function() {
            var spy = jasmine.createSpy("set").and.returnValue("ok");

            link.set(spy);
            input.set(spy);

            expect(spy.calls.count()).toBe(2);

            expect(link).toHaveHtml("ok");
            expect(input).toHaveProp("value", "ok");
        });

        it("should set a falsey value and not an empty string", function() {
            expect(input.set({
                value: false
            }).get("value")).toEqual("false");
            expect(input.set({
                value: 0
            }).get("value")).toEqual("0");
        });

        it("should set the selected option for a select element to matching string w/o falsy matches", function() {
            var form = ugma.add("form");
            form.set("innerHTML", "<select>" +
                "<option value=''>no value</option>" +
                "<option value='0'>value 0</option>" +
                "<option value='1'>value 1</option>" +
                "</select>");
            expect(form.query("select").set("value", 0).get("value")).toEqual("");
        });

        it("should set the type of a button", function() {
            expect(ugma.add("button").set({
                type: "button"
            }).get("type")).toEqual("submit");
        });

        it("accept object with overriden toString", function() {
            function Type() {
                this.name = "bar";
            }

            Type.prototype.toString = function() {
                return "foo";
            };

            input.set(new Type());
            expect(input.get()).toBe("foo");
            expect(input).not.toHaveAttr("name", "bar");
        });

        it("should add/remove boolean attributes", function() {
            var select = ugma.add("select");
            select.set("multiple", false);
            expect(select.get("multiple")).not.toBeUndefined();

            select.set("multiple", true);
            expect(select.get("multiple")).toBe(true);
        });

    });

});