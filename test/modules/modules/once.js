describe("once", function() {
    "use strict";

    var link, input, form, spy;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='once_test' href='#once_test'>test element</a><form id='once_form'><input id='once_input' required='required'/></form>");

        link = ugma.query("#once_test");
        input = ugma.query("#once_input");
        form = ugma.query("#once_form");

        spy = jasmine.createSpy("callback");
    });

    it("should return reference to 'this'", function() {
        expect(input.once("click", spy)).toEqual(input);
    });


});