describe("extend", function() {

    it("should throw if not a first argument", function() {
        expect(function() {
            ugma.extend();
        }).toThrow();
    });

    it("should throw if the first argument is a string value", function() {
        expect(function() {
            ugma.extend("");
        }).toThrow();
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() {
            ugma.extend(1);
        }).toThrow();
        expect(function() {
            ugma.extend(" * ", function() {});
        }).toThrow();
        expect(function() {
            ugma.extend("div > *", function() {});
        }).toThrow();
    });

    it("allows extending the Element prototype", function() {
        ugma.extend({
            foo: function() {
                return "bar";
            }
        });
        expect(ugma.native(document.createElement("a")).foo()).toBe("bar");
    });

    it("allows extending the Element prototype with multiple methods", function() {
        ugma.extend({
            mehran: function() {
                return "hatami";
            },
            hatami: function() {
                return "mehran";
            },

        });
        expect(ugma.native(document.createElement("a")).mehran()).toBe("hatami");
        expect(ugma.native(document.createElement("a")).hatami()).toBe("mehran");
    });


    it("allows extending the Document prototype", function() {
        ugma.extend({
            test: function() {
                return "foo";
            }
        }, true);

        expect(ugma.test()).toBe("foo");
    });

    it("allows extending the Document prototype with multiple methods", function() {
        ugma.extend({
            foo: function() {
                return "bar";
            },
            bar: function() {
                return "foo";
            }
        }, true);

        expect(ugma.foo()).toBe("bar");
        expect(ugma.bar()).toBe("foo");
    });


});