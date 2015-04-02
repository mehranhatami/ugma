describe("extend", function() {
   it("allows extending the Element prototype", function() {
        ugma.extend({
            foo: function() { return "bar"; }
        });
      expect(ugma.native(document.createElement("a")).foo()).toBe("bar");
    });

    it("allows extending the Document prototype", function() {
        ugma.extend({
            test: function() { return "foo" }
        },true);

        expect(ugma.foo()).toBe("bar");
    });
});
