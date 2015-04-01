describe("query", function() {
    "use strict";

    it("should find an element by id", function() {
        jasmine.sandbox.set("<a id='test'>test</a>");
        expect(ugma.query("#test")).toHaveId("test");

        jasmine.sandbox.set("<a id='test'>test<span id='test1'></span></a>");
        expect(ugma.query("#test").query("#test1")).toHaveId("test1");

        jasmine.sandbox.set("<a id='test'>test</a><span id='test2'></span>");
        expect(ugma.query("#test").query("#test2")).toBeMock();
    });

    it("should query by id event if node was detached", function() {
        jasmine.sandbox.set("<a id='test'>test<span id='test1'></span></a>");

        var el = ugma.query("#test");

        expect(el.query("#test1")).toHaveId("test1");

        el.remove();

        expect(el.query("#test1")).toHaveId("test1");
    });

    it("should query an element by class", function() {
        jasmine.sandbox.set("<a class='test321'>test</a>");

        expect(ugma.query(".test321")).toHaveClass("test321");
    });

 it("should find child by name", function() {
      var root = ugma.add("<div><div>text</div></div>");
      var innerDiv = root.queryAll("div");
      expect(innerDiv.length).toEqual(1);
      expect(innerDiv[0].get("textContent")).toEqual("text");
    });


    it("should query an element by class with context", function() {
        jasmine.sandbox.set("<p><a class='blog'>test</a></p>");
        expect(ugma.query("p").query(".blog")).toHaveClass("blog");
    });

    it("should query selectors with comma", function() {
        jasmine.sandbox.set("<div><h2><span/></h2><div><p><span/></p><p/></div></div>");
        expect(ugma.queryAll("h2, div p").length).toBe(3);
    });

    it("should find an element by selector", function() {
        jasmine.sandbox.set("<a class='test123'>test</a>");

        var domLink = ugma.query("a.test123");
        
        expect(domLink).toHaveTag("a");
        expect(domLink).toHaveClass("test123");
    });


    it("should query an element by selector", function() {
        jasmine.sandbox.set("<div id=test><a data-attr='0'>test</a></div>");
        expect(ugma.query("#test").query("[data-attr='0']")).toHaveAttr("data-attr");


        jasmine.sandbox.set("<div id=test><a data-attr='1'>test</a></div>");
        expect(ugma.query("#test").query("[data-attr='1']")).toHaveAttr("data-attr");


        jasmine.sandbox.set("<div class=test><a data-attr='2'>test</a></div>");
        expect(ugma.query(".test").query("[data-attr='2']")).toHaveAttr("data-attr");
        
        jasmine.sandbox.set("<div id=test><a data-attr2='2'></a></div><a data-attr1='1'></a><a data-attr3='3'></a>");
        expect(ugma.query("#test").query("> [data-attr2='2']")).toHaveAttr("data-attr2");
        expect(ugma.query("#test").query("+ [data-attr1='1']")).toHaveAttr("data-attr1");
        expect(ugma.query("#test").query("~ [data-attr3='3']")).toHaveAttr("data-attr3");
 
    });

    it("should return at least empty element(s)", function() {
        var foo = ugma.query("foo");

        expect(foo.query("a")).toBeMock();
        expect(foo.queryAll("a").length).toBe(0);
    });

    it("should fix querySelectorAll on element with context", function() {
        jasmine.sandbox.set("<div><p class='foo'><span></span></p></div>");

        var foo = ugma.query(".foo");

        expect(foo[0].querySelectorAll("div span").length).toBe(1);

        expect(foo.queryAll("div span").length).toBe(0);
        expect(foo.get("id")).toBeFalsy();
    });

    it("should throw error if the first argument is not a string", function() {
        expect(function() { ugma.query(1); }).toThrow();
    });

    it("should not throw error if selector is not valid", function() {
        jasmine.clock().install();

        expect(function() { ugma.query("$test"); }).not.toThrow();

        jasmine.clock().uninstall();
    });

    it("might return empty results", function() {
        expect(ugma.queryAll("details")).toEqual([]);
        expect(ugma.query("details")[0]).toBeUndefined();
    });

});