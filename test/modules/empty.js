describe("empty", function() {
    var div;

    beforeEach(function() {
        div = ugma.add("div>a+a");
    });

  it("should write a value", function() {
      var element = ugma.add("<div>abc</div>");
      expect(element.empty() == element).toBeTruthy();
      expect(element).toBeEmpty();
    });

    it("should remove child element(s) from ugma", function() {
        expect(div[0].childNodes.length).toBe(2);
        expect(div.empty()).toBe(div);
        expect(div).toBeEmpty();
    });

    it("should set text input value to empty string", function () {
        var input = ugma.add("input[value=foo]");
        expect(input).toHaveProp("value", "foo");
        expect(input.empty()).toBe(input);
        expect(input).toBeEmpty();
    });

    it("does nothing for empty nodes", function() {
        var empty = ugma.mock();
        expect(empty.empty()).toBe(empty);
    });
});
