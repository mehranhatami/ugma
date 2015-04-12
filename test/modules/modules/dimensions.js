describe("dimensions", function() {

    it("should get width() and height()", function() {

        var div = ugma.render("div").css({
            width: "200px",
            height: "200px"
        });
        ugma.append(div);

        expect(div.width()).toBe(200);
        expect(div.height()).toBe(200);
    });
});