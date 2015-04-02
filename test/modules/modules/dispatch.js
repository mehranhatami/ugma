describe("dispatch", function() {
    var input;

    beforeEach(function() {
        jasmine.sandbox.set("<input id='input'/>");

        input = ugma.query("#input");
    });

    it("should support a function to make a safe sync call", function() {
        var obj = {},
            callback = jasmine.createSpy("callback");

        input.dispatch(callback, 123, obj);
        expect(callback).toHaveBeenCalledWith(123, obj);

        ugma.dispatch(callback, obj, 321);
        expect(callback).toHaveBeenCalledWith(obj, 321);
    });

    it("should throw error for invalid argumetns", function() {
        expect(function() { input.dispatch({}) }).toThrow();
        expect(function() { input.dispatch(null) }).toThrow();
        expect(function() { input.dispatch(1) }).toThrow();
    });
});