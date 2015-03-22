describe("classes manipulation", function() {
    "use strict";

    var link;

    beforeEach(function() {
        jasmine.sandbox.set("<a id='test' class='test test1'></a>");

        link = ugma.query("#test");
    });

    describe("class", function() {

        it("should ignore comment elements", function() {
            var comment = ugma.native(document.createComment("something"));

            comment.addClass("whatever");
            comment.hasClass("whatever");
            comment.toggleClass("whatever");
            comment.removeClass("whatever");
        });

    });

    describe("hasClass", function() {

        it("should make sure that partial class is not checked as a subset", function() {

            link.addClass("a");
            link.addClass("b");
            link.addClass("c");
            expect(link.addClass("abc")).toEqual(link);
            expect(link.removeClass("abc")).toEqual(link);

        });

        it("should return 'true' if element has the class otherwise - 'false'", function() {
            expect(link.hasClass("test")).toBe(true);
            expect(link.hasClass("test2")).toBe(false);
        });

        it("should not accept multiple classes", function() {
            expect(link.hasClass("test", "test1")).toBe(true);
            expect(link.hasClass("test", "test2")).toBe(true);
        });

        it("should throw error if the first arg is not a string", function() {
            expect(function() {
                link.hasClass(1);
            }).toThrow();
            expect(function() {
                link.hasClass(function() {});
            }).toThrow();
            expect(function() {
                link.hasClass(null);
            }).toThrow();
            expect(function() {
                link.hasClass({});
            }).toThrow();
        });
    });

    describe("toggleClass", function() {

        it("should allow toggling of class", function() {

            expect(link.toggleClass("abc")).toBe(true);
            expect(link).toHaveClass("abc");

            expect(link.toggleClass("abc")).toBe(false);
            expect(link).not.toHaveClass("abc");

            expect(link.toggleClass("abc")).toBe(true);
            expect(link).toHaveClass("abc");

            expect(link.toggleClass("abc")).toBe(false);
            expect(link).not.toHaveClass("abc");

        });

        it("should make appropriate changes with single class", function() {
            expect(link.toggleClass("test3")).toBe(true);
            expect(link).toHaveClass("test3");

            expect(link.toggleClass("test3")).toBe(false);
            expect(link).not.toHaveClass("test3");
        });

        it("should support optional argument force", function() {
            expect(link.toggleClass("test", true)).toBe(true);
            expect(link).toHaveClass("test");

            expect(link.toggleClass("test3", false)).toBe(false);
            expect(link).not.toHaveClass("test3");
        });
    });

    describe("addClass", function() {

        it("should allow adding of class", function() {
            expect(link.addClass("abc")).toEqual(link);
            expect(link.hasClass("abc")).toEqual(true);

        });
        
        
      it('should allow multiple classes to be added', function() {
          link[0].className = '';
          link.addClass("foo", "bar", "baz");
        expect(link[0].className).toBe('foo bar baz');
      });

  
      it("should not add duplicate classes", function() {
            link[0].className = "foo";
            link.addClass("foo");
            expect(link[0].className).toBe("foo");
        });

    });

    describe("addClass, removeClass", function() {
        it("should return reference to 'this'", function() {
            expect(link.addClass("test2")).toBe(link);
            expect(link.removeClass("test2")).toBe(link);
        });

        it("should make appropriate changes with single class", function() {
            expect(link.addClass("test2")).toHaveClass("test2");
            expect(link.removeClass("test2")).not.toHaveClass("test2");
        });

        it("should make appropriate changes with multiple classes", function() {
            link.addClass("test2", "test3");

            expect(link).toHaveClass("test2");
            expect(link).toHaveClass("test3");

            link.removeClass("test2", "test3");

            expect(link).not.toHaveClass("test2");
            expect(link).not.toHaveClass("test3");
        });

        it("should throw error if the first arg is not a string", function() {
            expect(function() {
                link.addClass(1);
            }).toThrow();
            expect(function() {
                link.addClass(function() {});
            }).toThrow();
            expect(function() {
                link.addClass(null);
            }).toThrow();
            expect(function() {
                link.addClass({});
            }).toThrow();

            expect(function() {
                link.removeClass(1);
            }).toThrow();
            expect(function() {
                link.removeClass(function() {});
            }).toThrow();
            expect(function() {
                link.removeClass(null);
            }).toThrow();
            expect(function() {
                link.removeClass({});
            }).toThrow();
        });
    });
});