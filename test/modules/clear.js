describe("clear", function() {
   
    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>");

         link = ugma.query("#test");
    });

  it("should read boolean values", function() {

    it("should clear attribute", function() {
        expect(link.clear("id")).not.toHaveAttr("id");
        expect(link.clear("href")).not.toHaveAttr("href");
    });

       
    });
});