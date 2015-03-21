describe("has", function() {
   
    var checkbox, option;

    beforeEach(function() {
        jasmine.sandbox.set("<option id='option'><option/><input id='chkbox' type='checkbox'/>");

        checkbox = ugma.query("#chkbox");
        option = ugma.query("#option");
    });

  it("should read boolean values", function() {

        checkbox.set("checked", true);

        expect(checkbox.has("checked")).toBe(true);

        option.set("selected", true);

        expect(option.has("selected")).toBe(true);
    });
});
