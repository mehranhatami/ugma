describe("off", function() {
    "use strict";

    var input, link, obj = {test: function() { }, test2: function() {}}, spy;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='link'><input id='input'></a>");

        input = ugma.query("#input");
        link = ugma.query("#link");

        spy = jasmine.createSpy("click");
    });


    it("should do nothing when no listener was registered with bound", function() {
      link.off("click");
      link.off("click", function() {});
    });

 it("should do nothing when a specific listener was not registered", function() {
      link.on("click", function() {});

      link.off("mouseenter", function() {});
    });
    
    it("should remove event callback", function() {
        input.on("click", spy).off("click", null).trigger("click");
        expect(spy).not.toHaveBeenCalled();

        input.on("click", spy).off("click", spy).trigger("click");
        expect(spy).not.toHaveBeenCalled();

        input.on("click", "a", spy).off("click", "a", spy).trigger("click");
        expect(spy).not.toHaveBeenCalled();
    });

    it("supports selector argument", function() {
        link.on("click", spy).on("click", "input", spy);
        input.trigger("click");
        expect(spy.calls.count()).toBe(2);

        link.off("click", "input", spy);
        input.trigger("click");
        expect(spy.calls.count()).toBe(3);
    });

    it("should remove all event handlers if called without the second argument", function() {
        spyOn(obj, "test");
        spyOn(obj, "test2");

        link.on("click", obj.test).on("click", obj.test2).off("click");
        input.trigger("click");

        expect(obj.test).not.toHaveBeenCalled();
        expect(obj.test2).not.toHaveBeenCalled();
    });

    it("should throw error if agruments are invalid", function() {
        expect(function() { link.off(123); }).toThrow();
    });

});