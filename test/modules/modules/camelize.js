describe("ugma.camelize", function() {
    "use strict";

    it("should leave non-dashed strings alone", function() {
        expect(ugma.camelize("foo")).toBe("foo");
        expect(ugma.camelize("")).toBe("");
        expect(ugma.camelize("fooBar")).toBe("fooBar");
    });

    it("should covert dash-separated strings to camelCase", function() {
        expect(ugma.camelize("foo-bar")).toBe("fooBar");
        expect(ugma.camelize("foo-bar-baz")).toBe("fooBarBaz");
        expect(ugma.camelize("foo:bar_baz")).toBe("fooBarBaz");
    });


    it("should covert browser specific css properties", function() {
        expect(ugma.camelize("-moz-foo-bar")).toBe("MozFooBar");
        expect(ugma.camelize("-webkit-foo-bar")).toBe("webkitFooBar");
        expect(ugma.camelize("-webkit-foo-bar")).toBe("webkitFooBar");
    });
});