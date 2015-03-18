describe("ugma.injectScript", function() {
    "use strict";

    var scripts;

    beforeEach(function() {
        scripts = [];

        spyOn(document, "createElement").and.callFake(function() {
            var script = {};

            scripts.push(script);

            return script;
        });
    });

    it("executes callback when script is loaded", function(done) {
        ugma.injectScript("foo", done);

        var script = scripts[0];

        expect(script.src).toBe("foo");

        script.onload();
    });


    it("should throw error if arguments are invalid", function() {
        expect(function() { ugma.injectScript(1) } ).toThrow();
    });
});