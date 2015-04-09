describe("deserializeValue", function() {

    "use strict";

    it("should deserialize values", function() {

        expect(ugma.deserializeValue("false")).toBe(false);
        expect(ugma.deserializeValue("true")).toBe(true);
        expect(ugma.deserializeValue("null")).toBe(null);
        expect(ugma.deserializeValue("42")).toBe(42);
        expect(ugma.deserializeValue("42.5")).toBe(42.5);
        expect(ugma.deserializeValue("Hello, World!")).toBe("Hello, World!");
    });
});