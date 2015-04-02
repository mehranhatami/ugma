describe("visibility", function() {
    "use strict";

    var link;

    beforeEach(function() {
        link = ugma.render("<a>123</a>");

        jasmine.sandbox.set(link);
    });

    describe("hide", function() {
        it("should support exec callback", function(done) {
            expect(link.hide(done));
        });

        it("should throw error if arguments are invalid", function() {
            // expect(function() { link.hide("123") }).toThrow();
            expect(function() {
                link.hide(-10);
            }).toThrow();
            expect(function() {
                link.hide(true);
            }).toThrow();
        });

    });

    describe("show", function() {
        it("should trigger callback for initially hidden elements", function(done) {
            link.addClass("hidden");

            link.show("fade", done);
        });

        it("should throw error if arguments are invalid", function() {
            // expect(function() { link.show("123") }).toThrow();
            expect(function() {
                link.show(-10);
            }).toThrow();
            expect(function() {
                link.show(true);
            }).toThrow();
        });

        it("should handle initially invisible element", function(done) {
            link.addClass("invisible");

            link.show(function() {
                expect(link.css("visibility")).not.toBe("hidden");
                expect(link).toHaveAttr("aria-hidden", "false");

                done();
            });
        });

    });

    describe("toggle", function() {
        beforeEach(function() {
            link = ugma.render("<a>123</a>");

            jasmine.sandbox.set(link);
        });

        it("should allow to toggle visibility", function(done) {
            expect(link.matches(":hidden")).toBe(false);

            link.toggle(function() {
                expect(link.matches(":hidden")).toBe(true);

                link.toggle(function() {
                    expect(link.matches(":hidden")).toBe(false);

                    done();
                });
            });
        });

        it("should update aria-hidden", function(done) {
            expect(link).not.toHaveAttr("aria-hidden");

            link.hide(function() {
                expect(link).toHaveAttr("aria-hidden", "true");

                link.show(function() {
                    expect(link).toHaveAttr("aria-hidden", "false");

                    done();
                });
            });
        });

        it("cancel previous call if it was scheduled", function(done) {
            var firstSpy = jasmine.createSpy("first"),
                secondSpy = jasmine.createSpy("second");

            secondSpy.and.callFake(function() {
                expect(firstSpy).not.toHaveBeenCalled();

                done();
            });

            link.toggle(firstSpy);
            link.toggle(secondSpy);
        });

        it("should handle unknown aria-hidden values as false", function(done) {
            expect(link.matches(":hidden")).toBe(false);
            link.set("aria-hidden", "123");
            expect(link.matches(":hidden")).toBe(false);
            link.toggle(function() {
                expect(link.matches(":hidden")).toBe(true);

                done();
            });
        });

    });
});