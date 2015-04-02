describe("has", function() {
   
   var input;

    beforeEach(function() {
        jasmine.sandbox.set("<input type='checkbox' id='has' required>");

         input = ugma.query("#has");
    });

 it("should return true/false if property/attribute exists", function() {
        input[0].checked = true;
        expect(input.has("required")).toBe(true);
        expect(input.has("unknown")).toBe(false);
        expect(input.has("checked")).toBe(true);

        input[0].checked = false;
        expect(input.has("checked")).toBe(false);
    });

    it("should throw error if arguments are invalid", function() {
        expect(function() { input.has(1); }).toThrow();
    });
});
