describe("add", function() {
    "use strict";
    
     it("should create new DOM element if the first argument is native element", function() {
        var el = ugma.add(document.createElement("em"));

        jasmine.sandbox.set(el);

        expect(el).toHaveTag("em");
    });
    
    it("should add single ugma element if parameter is not an HTML string", function() {
        var link = ugma.add(ugma.format("<a id=\"{id}\" title=\"{title}\"></a>", {id: "b", title: "c"}));

        jasmine.sandbox.set(link);

        expect(link).toHaveTag("a");
        expect(link.get("id")).toBe("b");
        expect(link.get("title")).toBe("c");
    });

    it("should parse HTML strings", function() {
        var el = ugma.add("<a><span></span></a>");

        jasmine.sandbox.set(el);

        expect(el).toHaveTag("a");
        expect(el.child(0)).toHaveTag("span");

        expect(ugma.addAll("a+b").length).toBe(2);
    });
    

    it("should accept empty strings", function() {
        var el = ugma.add("");

        expect(el).toBeDefined();
        expect(el[0]).not.toBeDefined();
    });

    it("should trim inner html strings", function() {
        var el = ugma.add("   <a><span></span></a>  ");

        expect(el).toHaveTag("a");
        expect(el.child(0)).toHaveTag("span");
    });

    it("should support varMap for HTML strings", function() {
        var el = ugma.add("<a>{0}</a>", ["yo"]);

        expect(el).toHaveTag("a");
        expect(el.get()).toBe("yo");
    });

    it("should parse emmet-like expressions", function() {
        var el = ugma.add("ul>li");

        jasmine.sandbox.set(el);

        expect(el).toHaveTag("ul");
        expect(el.child(0)).toHaveTag("li");
    });

    it("should throw error if argument is invalid", function() {
        expect(function() { ugma.add(2); }).toThrow();
        // expect(function() { ugma.add(null); }).toThrow();
        expect(function() { ugma.add({}); }).toThrow();
    });

    it("should create an element with type='email'", function(){
		var el = ugma.add("input").set("type", "email");
		expect(el.get("type").match(/email|text/)).toBeTruthy();
	});

    describe("addAll", function() {
        it("should always return array of elements", function() {
            var els = ugma.addAll("a");

            expect(Array.isArray(els)).toBeTruthy();
            expect(els[0]).toHaveTag("a");
        });

        it("should wrap element to div if HTML string has several root nodes", function() {
            var el = ugma.addAll("a+b");

            expect(el[0]).toHaveTag("a");
            expect(el[1]).toHaveTag("b");
        });

        it("should skip non elements", function() {
            var links = ugma.addAll("a+`text`+a");

            expect(links.length).toBe(2);
            expect(links[0]).toHaveTag("a");
            expect(links[1]).toHaveTag("a");
        });
    });
});