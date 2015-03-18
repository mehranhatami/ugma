describe("css", function() {
    "use strict";

    var link, link1;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test0' style='z-index:2;line-height:2;color:red;padding:5px;margin:2px;border:1px solid;float:left;display:block;width:100px'>test</a><a id='test1' style='line-height:2;color:red;padding:5px;margin:2px;border:1px solid;float:left;display:block;width:100px'>test</a><div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'>");

        link = ugma.query("#test0");
        link1 = ugma.query("#test1"); 
    });

    it("should return width / height on disconnected node", function() {
        var div = ugma.native(document.createElement("div")).css({
            "width": 4,
            "height": 4
        });

        expect(div.css("width")).toBe("4px");
        expect(div.css("height")).toBe("4px");
    });

    it("should return width / height on disconnected node", function() {

        expect(ugma.query("input").css("height")).toBe("20px"); // height on hidden input
        expect(ugma.query("textarea").css("height")).toBe("20px"); // height on hidden textarea
    });

    describe("getter", function() {
        it("should read style property", function() {
            expect(link.css("color")).toBe("red");
        });

        it("should read properties by dash-separated key", function() {
            expect(link.css("line-height")).toBe("2");
        });


        it("should handle composite properties", function() {
            expect(link.css("padding")).toBe("5px 5px 5px 5px");
            expect(link.css("margin")).toBe("2px 2px 2px 2px");
            expect(link.css("border-width")).toBe("1px 1px 1px 1px");
            expect(link.css("border-style")).toBe("solid solid solid solid");
        });

        it("should read runtime style property if style doesn't contain any value", function() {
            expect(link.css("font-size")).toBeTruthy();
        });

        it("should handle opacity", function() {
            link.css({"opacity": ""});
            expect(link.css("opacity")).toBe("1");
            expect(link1.css("opacity")).toBe("1"); 
        });


    it("should handle font-size property", function() {
        link.css({"font-size": "30px"});
        expect(link.css("font-size")).toBe("30px");
    });


    it("should handle float", function() {
      link.css({"float": "right"});
        expect(link.css("float")).toBe("right"); // height on hidden textarea
    });


        it("should fix float property name", function() {
            expect(link.css("float")).toBe("left");
        });

        it("should throw error if arguments are invalid", function() {
            expect(function() {
                link.css(1);
            }).toThrow();
        });
/*
        it("should support array", function() {
            expect(link.css(["float", "line-height"])).toEqual({
                "float": "left",
                "line-height": "2"
            });
            expect(ugma.mock().css(["float", "line-height"])).toEqual({});
        });
    });
*/
    describe("setter", function() {
        it("should return reference to 'this'", function() {
            expect(link.css("color", "white")).toBe(link);
        });

        it("should set style properties", function() {
            expect(link.css("color", "white")).toHaveStyle("color", "white");
            expect(link.css("float", "right").css("float")).toBe("right");
        });

        it("should support styles object", function() {
            link.css({
                color: "white",
                padding: "5px"
            });

            expect(link).toHaveStyle("color", "white");
            expect(link).toHaveStyle("padding", "5px");
        });

        it("should support setting of composite properties", function() {
            var value = "7px";

            link.css("border-width", value);

            expect(link.css("border-left-width")).toBe(value);
            expect(link.css("border-top-width")).toBe(value);
            expect(link.css("border-bottom-width")).toBe(value);
            expect(link.css("border-right-width")).toBe(value);
        });

        it("should support number values", function() {
            link.css("line-height", 7);

            expect(link.css("line-height")).toBe("7");

            link.css("width", 50);

            expect(link.css("width")).toBe("50px");
        });

        it("should handle vendor-prefixed properties", function() {
            var offset = link.offset();

            link.css("box-sizing", "border-box");

            expect(link.offset()).not.toEqual(offset);
        });

        it("should not add px suffix to some css properties", function() {
            var props = "orphans line-height widows z-index".split(" "),
                propName, i, n;

            for (i = 0, n = props.length; i < n; ++i) {
                propName = props[i];

                expect(link.css(propName, 5).css(propName)).not.toBe("5px");
            }
        });

        it("should accept function", function() {
            var spy = jasmine.createSpy("value").and.returnValue(7);

            link.css("line-height", spy);

            expect(spy).toHaveBeenCalledWith(link);
            expect(link.css("line-height")).toBe("7");
        });

        it("should allow to clear style value", function() {
            expect(link.css("padding", null).css("padding")).toBe("0px 0px 0px 0px");
            expect(link.css("z-index", "").css("z-index")).toBe("auto");
            expect(link.css("float", undefined).css("float")).toBe("none");
        });

        it("read/writes non-existent properties", function() {
            expect(link.css("some-prop")).toBeUndefined();
            expect(link.css("some-prop", "test")).toBe(link);
            expect(link.css("some-prop")).toBe("test");
        });

        it("should throw error if arguments are invalid", function() {
            expect(function() {
                link.css(1);
            }).toThrow();
            expect(function() {
                link.css("color", "red", "yellow");
            }).toThrow();
        });

        it("should return undefined empty nodes", function() {
            var emptyEl = ugma.query("xxx");

            expect(emptyEl.css("color")).toBeUndefined();
            expect(emptyEl.css("color", "red")).toBe(emptyEl);
        });
    });

});