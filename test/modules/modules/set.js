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

        var checkbox = ugma.render("<input type='checkbox'>");

        expect(checkbox.get("checked")).toBe(false);

        checkbox.set("checked", true);
        expect(checkbox.get("checked")).toBe(true);

        checkbox.set("checked", "");
        expect(checkbox.get("checked")).toBe(false);

        checkbox.set("checked", "lala");
        expect(checkbox.get("checked")).toBe(true);

        expect(checkbox.set("checked", null)).not.toHaveAttr("checked");
    });

    it("should set and remove boolean element property", function() {

        var checkbox = ugma.render("<input type='checkbox'>");

        checkbox.set("checked", "checked");

        expect(checkbox.get("checked")).toBe(true);

        checkbox.set("checked", false).set("checked", true).set("checked", false);

        expect(checkbox[0].checked).toBe(false);

        txt.set("readOnly", true).set("readonly", undefined);

        expect(txt[0].readOnly).toBe(false);

        var first = ugma.render("<div Case='mixed'></div>");

        // case of attribute doesn't matter
        expect(first.get("case")).toBe("mixed");

        first.set("Case", undefined);

        expect(first.get("case")).toBe(null);
    });

    it("should add/remove boolean attributes", function() {
        var select = ugma.render("select");
        select.set("multiple", false);
        expect(select.get("multiple")).not.toBeUndefined();

        select.set("multiple", true);
        expect(select.get("multiple")).toBe(true);
    });


    it("should handle tabIndex", function() {

        jasmine.sandbox.set("<div id='tabindex-tests'>" +
            "<ol id='listWithTabIndex' tabindex='5'> " +
            "<li id='foodWithNegativeTabIndex' tabindex='-1'>Rice</li> " +
            "<li id='foodNoTabIndex'>Beans</li> " +
            "<li>Blinis</li> " +
            "<li>Tofu</li> " +
            "</ol> " +
            "<div id='divWithNoTabIndex'>I'm hungry. I should...</div> " +
            "<span>...</span><a href='#' id='linkWithNoTabIndex'>Eat lots of food</a><span>...</span> | " +
            "<span>...</span><a href='#' id='linkWithTabIndex' tabindex='2'>Eat a little food</a><span>...</span> | " +
            "<span>...</span><a href='#' id='linkWithNegativeTabIndex' tabindex='-1'>Eat no food</a><span>...</span> " +
            "<span>...</span><a id='linkWithNoHrefWithNoTabIndex'>Eat a burger</a><span>...</span> " +
            "<span>...</span><a id='linkWithNoHrefWithTabIndex' tabindex='1'>Eat some funyuns</a><span>...</span> " +
            "<span>...</span><a id='linkWithNoHrefWithNegativeTabIndex' tabindex='-1'>Eat some funyuns</a><span>...</span> " +
            "<input id='inputWithoutTabIndex'/> " +
            "<button id='buttonWithoutTabIndex'></button> " +
            "<textarea id='textareaWithoutTabIndex'></textarea> " +
            "<menu type='popup'> " +
            "<menuitem id='menuitemWithoutTabIndex' command='submitbutton' default/> " +
            "</menu> " +
            "</div>");

        //  equal( ugma.query("#listWithTabIndex").get("tabindex"), "5", "not natively tabbable, with tabindex set to 0" );      
        var listWithTabIndex = ugma.query("#listWithTabIndex");
        var linkWithNoTabIndex = ugma.query("#linkWithNoTabIndex");
        var linkWithTabIndex = ugma.query("#linkWithTabIndex");
        var linkWithNegativeTabIndex = ugma.query("#linkWithNegativeTabIndex");

        expect(listWithTabIndex.get("tabindex")).toBe(5);
        expect(ugma.query("#divWithNoTabIndex").get("tabindex")).toBe(-1);

        expect(linkWithNoTabIndex.get("tabindex")).toBe(0);
        expect(linkWithTabIndex.get("tabindex")).toBe(2);
        expect(linkWithNegativeTabIndex.get("tabindex")).toBe(-1);

        expect(ugma.query("#linkWithNoHrefWithNoTabIndex").get("tabindex")).toBe(0);
        expect(ugma.query("#linkWithNoHrefWithTabIndex").get("tabindex")).toBe(1);

        var element = ugma.query("#divWithNoTabIndex");

        expect(element.get("tabindex")).toBe(-1);

        // set a positive string
        element.set("tabindex", "1");
        expect(element.get("tabindex")).toBe(1);

        // set a zero string
        element.set("tabindex", "0");
        expect(element.get("tabindex")).toBe(0);

        // set a negative string
        element.set("tabindex", "-1");

        expect(element.get("tabindex")).toBe(-1);

        // set a positive number
        element.set("tabindex", 1);
        expect(element.get("tabindex")).toBe(1);

        // set a zero number
        element.set("tabindex", 0);
        expect(element.get("tabindex")).toBe(0);

        // set a negative number
        element.set("tabindex", -1);
        expect(element.get("tabindex")).toBe(-1);

        // cloned element
        var clone = element.clone(true);
        clone.set("tabindex", 1);
        expect(clone[0].getAttribute("tabindex")).toBe("1");
    });

    it("should set and remove value attributes", function() {

        jasmine.sandbox.set("<select name='select1' id='select1'>" +
            "<option id='option1a' class='emptyopt' value=''>Nothing</option>" +
            "<option id='option1b' value='1'>1</option>" +
            "<option id='option1c' value='2'>2</option>" +
            "<option id='option1d' value='3'>3</option>" +
            "</select>" +
            "<select name='select2' id='select2'>" +
            "<option id='option2a' class='emptyopt' value=''>Nothing</option>" +
            "<option id='option2b' value='1'>1</option>" +
            "<option id='option2c' value='2'>2</option>" +
            "<option id='option2d' selected='selected' value='3'>3</option>" +
            "</select>" +
            "<select name='select3' id='select3' multiple='multiple'>" +
            "<option id='option3a' class='emptyopt' value=''>Nothing</option>" +
            "<option id='option3b' selected='selected' value='1'>1</option>" +
            "<option id='option3c' selected='selected' value='2'>2</option>" +
            "<option id='option3d' value='3'>3</option>" +
            "<option id='option3e'>no value</option>" +
            "</select>" +
            "<select name='select4' id='select4' multiple='multiple'>" +
            "<optgroup disabled='disabled'>" +
            "<option id='option4a' class='emptyopt' value=''>Nothing</option>" +
            "<option id='option4b' disabled='disabled' selected='selected' value='1'>1</option>" +
            "<option id='option4c' selected='selected' value='2'>2</option>" +
            "</optgroup>" +
            "<option selected='selected' disabled='disabled' id='option4d' value='3'>3</option>" +
            "<option id='option4e'>no value</option>" +
            "</select>" +
            "<select name='select5' id='select5'>" +
            "<option id='option5a' value='3'>1</option>" +
            "<option id='option5b' value='2'>2</option>" +
            "<option id='option5c' value='1' data-attr=''>3</option>" +
            "</select>");

        expect(txt.get("value")).toBe("Test");

        expect(ugma.query("#select2").inner()).toBe("3");

        var sel3 = ugma.query("#select3").inner();
        
        expect(Array.isArray(sel3)).toBe(true);

        expect(sel3[0]).toBe("1");        
        
        expect(sel3[1]).toBe("2");        

        expect(ugma.query("#select2").get("selectedIndex")).toBe(3);

        expect(ugma.query("#option3c").inner()).toBe("2");

        expect(ugma.query("#option3a").inner()).toBe("");

        expect(ugma.query("#option3e").inner()).toBe("no value");

        expect(ugma.query("#option3a").inner()).toBe("");

        ugma.query("#select3").inner("");

        expect(ugma.query("#select5").inner()).toBe("3");

        // use content() method for this
        ugma.query("#select5").inner(1);

        // check content on ambiguous select.
        expect(ugma.query("#select5").inner()).toBe("1");

        // use content() method for this
        ugma.query("#select5").inner(3);

        // check content on ambiguous select.
        expect(ugma.query("#select5").inner()).toBe("3");

        ugma.query("#select5").inner("");
        expect(ugma.query("#select5").inner()).toBe("");
    });

   it("should get an array of selected elements from a multi select", function() {

      expect(ugma.render(
        "<select multiple>" +
          "<option selected>test 1</option>" +
          "<option selected>test 2</option>" +
        "</select>").get()).toEqual(["test 1", "test 2"]);

      expect(ugma.render(
        "<select multiple>" +
          "<option selected>test 1</option>" +
          "<option>test 2</option>" +
        "</select>").get()).toEqual(["test 1"]);


      expect(ugma.render(
        "<select multiple>" +
          "<option>test 1</option>" +
          "<option>test 2</option>" +
        "</select>").get()).toEqual(null);
   });

    it("should return reference to 'this'", function() {
        expect(link.set("id", "t")).toBe(link);
        // expect(inputs.set("id", "t")).toBe(inputs);
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

        link.set("style", "position:absolute");

        expect(link.css("position")).not.toBe("left");
        expect(link.css("position")).toBe("absolute");

    });

    it("should return this for empty nodes", function() {
        var empty = ugma.query("some-node");

        expect(empty.set("attr", "test")).toBe(empty);
    });

    it("should use 'innerHTML' or 'value' if name argument is undefined", function() {
        var value = "set-test-changed";

        link.set(value);
        input.set(value);

        expect(link).toHaveHtml(value);
        expect(input).toHaveProp("value", value);
    });

    it("should set select value properly", function() {
        var select = ugma.render("<select><option>AM</option><option>PM</option></select>");

        expect(select.get()).toBe("AM");
        select.set("PM");
        expect(select.get()).toBe("PM");
        select.set("MM");
        expect(select.get()).toBe("");
    });

    it("should accept function", function() {
        var spy = jasmine.createSpy("set").and.returnValue("ok");

        link.set(spy);
        input.set(spy);

        expect(spy.calls.count()).toBe(2);

        expect(link).toHaveHtml("ok");
        expect(input).toHaveProp("value", "ok");
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

    it("should set the html of select", function() {
        var html = "<option>option 1</option><option selected='selected'>option 2</option>";

        var select = ugma.render("select").set("innerHTML", html);

        expect(select.children().length).toEqual(2);
        expect(select[0].options.length).toEqual(2);
        expect(select[0].selectedIndex).toEqual(1);
    });

    it("should set the html of table", function() {
        var html = "<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class='cell'>cell 1</td><td>cell 2</td></tr></tbody>";

        var table = ugma.render("table").set("innerHTML", html);

        expect(table.children().length).toEqual(1);
        expect(table.first().first().children().length).toEqual(2);
        expect(table.first().last().first().get("className")).toEqual("cell");
    });

    it("should set the text of an element", function() {
        var div = ugma.render("div").set("textContent", "some text content");
        expect(div.get("textContent")).toEqual("some text content");
        expect(div[0].innerHTML).toEqual("some text content");
    });

    it("should set the style attribute of an element", function() {
        var style = "font-size:12px;line-height:23px;";
        var div = ugma.render("div").set("style", style);
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

    it("should set various attributes of a table element", function() {
        var table = ugma.render("table").set({
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
        var div = ugma.render("div>a+a");
        expect(div[0].childNodes.length).toBe(2);
        expect(div.inner(ugma.render("b"))).toBe(div);
        expect(div[0].childNodes.length).toBe(1);
        expect(div.child(0)).toHaveTag("b");
    });

    it("should set value of text input to provided string value", function() {
        var input = ugma.render("input[value=foo]");
        expect(input.inner("bar")).toBe(input);
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
        var form = ugma.render("form");
        form.set("innerHTML", "<select>" +
            "<option value=''>no value</option>" +
            "<option value='0'>value 0</option>" +
            "<option value='1'>value 1</option>" +
            "</select>");
        expect(form.query("select").set("value", 0).get("value")).toEqual("");
    });

    it("should set the type of a button", function() {
        expect(ugma.render("button").set({
            type: "button"
        }).get("type")).toEqual("submit");
    });

    it("should accept object with overriden toString", function() {
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

    it("should fix misspelled language attribute", function() {
        expect(input.set("lang", "zh_CN")).toHaveAttr("lang", "zh-cn");
        expect(input.set("lang", "en_US")).toHaveAttr("lang", "en-us");
    });
});