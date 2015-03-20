describe("data", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<div id='test'</div>");

        link = ugma.query("#test");
    });

    it("should handle custom data-attributes", function() {
        link.custom({
            "test1": "test1",
            "test2": "test2"
        });
        expect(link).toHaveAttr("data-test1", "test1");
        expect(link).toHaveAttr("data-test2", "test2");
    });

    it("should handle private properties", function() {

        link.data({
            "test1": "test1",
            "test2": "test2"
        });

        expect(link.data("test1")).toBe("test1");
        expect(link.data("test2")).toBe("test2");
    });

    it("should handle data types", function() {
        [null, true, false, 0, 1, "", [],
            [1], {}, {
                foo: "bar"
            },
            new Date(), /test/,
            function() {}
        ].forEach(function(value) {
            expect(link.data("test", value).data("test")).toBe(value);
        });
    });
    
    
     it("should handle special types", function() {

        expect(link.data("pointe", "5.5E3").data("pointe")).toBe("5.5E3");
        expect(link.data("grande", "5.574E9").data("grande")).toBe("5.574E9");        
        expect(link.data("bigassnum", "123456789123456789123456789").data("bigassnum")).toBe("123456789123456789123456789");        
        expect(link.data("badjson", "{123}").data("badjson")).toBe("{123}");
        expect(link.data("space", " ").data("space")).toBe(" ");        
        expect(link.data("point", "5.5").data("point")).toBe("5.5");
        expect(link.data("false", "false").data("false")).toBe("false");        
    });

     it("should handle special custom-data types", function() {

        expect(link.custom("pointe", "5.5E3").custom("pointe")).toBe("5.5E3");
        expect(link.custom("grande", "5.574E9").custom("grande")).toBe("5.574E9");        
        expect(link.custom("bigassnum", "123456789123456789123456789").data("bigassnum")).toBe("123456789123456789123456789");        
        expect(link.custom("badjson", "{123}").custom("badjson")).toBe("{123}");
        expect(link.custom("space", " ").custom("space")).toBe(" ");        
        expect(link.custom("point", "5.5").custom("point")).toBe("5.5");
        expect(link.custom("false", "false").custom("false")).toBe("false");        
    });

    it("shoud remove private properties", function() {
        link.custom("test", "yeah");
        expect(link).toHaveAttr("data-test", "yeah");
        link.custom("test", null);
        expect(link).not.toHaveAttr("data-test", "yeah");
    });
    
    
    it("shoud be stored in _ object", function() {
        link.custom("test", "yeah");

        expect(link).not.toHaveAttr("_test", "yeah");
        expect(link).not.toHaveProp("_test", "yeah");
    });

    it("should delete custom properties", function() {

        link.data({
            "test1": "test1",
            "test2": "test2"
        });

        link.data("test1", null);

        expect(link.data("test1")).toBe(null);
        expect(link.data("test2")).toBe("test2");
    });

});