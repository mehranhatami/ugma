describe("clear", function() {

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' href='#'>set-test</a><input id='set_input'/><input id='set_input1'/><form id='form' action='formaction'>");

        link = ugma.query("#test");
    });

        it("should clear attribute", function() {
            expect(link.clear("id")).not.toHaveAttr("id");
            expect(link.clear("href")).not.toHaveAttr("href");
        });

        it("should set and clear checked boolean attribute", function() {
            
            expect(link.set("checked", "checked")).toHaveAttr("checked");
            
            expect(link.has("checked")).toBe(true);
            
            expect(link.clear("checked")).not.toHaveAttr("checked");

            expect(link.has("checked")).toBe(false);

        });

        it("should normalize, and set and clear checked boolean attribute", function() {
            expect(link.set("cHeckEd", "checked")).toHaveAttr("checked");
            expect(link.clear("cHeckEd")).not.toHaveAttr("checked");
        });
});