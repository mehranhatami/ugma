/* globals XHR */

describe("XHR", function() {
    "use strict";

    beforeEach(function() {
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();

        this.mockXhr = null;
    });

    it("should trigger fulfilled handler", function(done) {
        XHR.get("url", {cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr).toBeDefined();
        expect(this.mockXhr.url).toBe("url");
        expect(this.mockXhr.method).toBe("GET");

        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "text/plain",
            "responseText": "awesome response"
        });

        this.spy.and.callFake(function(text) {
            expect(text).toBe("awesome response");

            done();
        });
    });

    it("handles error responses", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 500,
            "contentType": "text/plain",
            "responseText": "error response"
        });

        this.spy.and.callFake(function(response) {
            expect(response).toBe("error response");

            done();
        });
    });

    it("should handle timeouts", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.ontimeout();

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);
            expect(err.message).toBe("timeout");

            done();
        });
    });

    it("should handle aborted responses", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.onabort();

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);
            expect(err.message).toBe("abort");

            done();
        });
    });

    it("should handle errored responses", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.onerror();

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);
            expect(err.message).toBe("error");

            done();
        });
    });

    it("parses JSON reponses", function(done) {
        var response = {a: "b"};

        XHR.get("url", {json: false}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "application/json; charset=UTF-8",
            "responseText": JSON.stringify(response)
        });

        this.spy.and.callFake(function(data) {
            expect(data).toEqual(response);

            done();
        });
    });

    it("returns error for invalid JSON reponses", function(done) {
        XHR.get("url", {json: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "application/json",
            "responseText": "{123:123}"
        });

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);

            done();
        });
    });
    
    
    
    
    
    
    describe("XHR mimeType", function() {

    beforeEach(function() {
        this.randomUrl = String(Date.now());
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();

        this.mockXhr = null;
    });

    it("allows to force JSON response parsing", function(done) {
        var response = {a: "b"};

        XHR.get(this.randomUrl, {mimeType: "json"}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "text/plain",
            "responseText": JSON.stringify(response)
        });

        this.spy.and.callFake(function(data) {
            expect(data).toEqual(response);

            done();
        });
    });
});
    
    
    
describe("XHR - options", function() {

    beforeEach(function() {
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();

        this.mockXhr = null;
    });

    it("should send query string for POST requests", function() {
        XHR.post("url1", {data: "a=b&c=1"}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url1");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a=b&c=1");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    });

    it("should send query string for GET requests", function() {
        XHR.get("url3", {data: "a=b&c=1"}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url3?a=b&c=1");
        expect(this.mockXhr.method).toBe("GET");
        expect(this.mockXhr.params).toBeNull();
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest"});
    });

    it("should support array values in data", function() {
        XHR.post("url4", {data: {a: ["1", "2"]}}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url4");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a=1&a=2");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    });

    it("should serialize object data", function() {
        XHR.post("url2", {data: {"a+b": "c d", v: 1}}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url2");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a%2Bb=c+d&v=1");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    });

    it("should send json string", function() {
        XHR.post("url", {json: {a: "b", c: 123}}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("{\"a\":\"b\",\"c\":123}");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/json; charset=UTF-8"});
    });
});
    
    
    
    describe("XHR options", function() {

    beforeEach(function() {
        this.randomUrl = String(Date.now());
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();

        this.mockXhr = null;
    });

    it("should have default settings", function() {
        expect(XHR.options).toEqual({
            timeout: 15000,
            charset: "UTF-8",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
    });

    it("allows to override default headers", function() {
        XHR.get("url4", {cacheBurst: false, headers: {"X-Requested-With": null}}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url4");
        expect(this.mockXhr.method).toBe("GET");
        expect(this.mockXhr.requestHeaders).toEqual({});
    });

    it("should set timeout", function() {
        XHR.get("url1").then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.timeout).toBe(15000);

        XHR.get("url1", {timeout: 10000}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.timeout).toBe(10000);
    });

    it("can emulate extra HTTP methods", function() {
        XHR.put(this.randomUrl, {emulateHTTP: "_method"}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe(this.randomUrl + "?_method=PUT");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.requestHeaders).toEqual({
            "X-Requested-With": "XMLHttpRequest",
            "X-Http-Method-Override": "PUT"
        });
    });
});
    
    
    
    
   
   describe("serialize", function() {

    it("serializes DOM nodes", function() {
        var node = document.createElement("input");

        node.name = "foo";
        node.value = "bar";
        expect(XHR.serialize(node)).toEqual({ foo: "bar" });

        node.name = "";
        expect(XHR.serialize(node)).toEqual({});
    });

    it("retuns empty object for invalid elements", function() {
        expect(XHR.serialize(document.documentElement)).toEqual({});
    });

    describe("form elements", function() {
        testForm("<input type='text' name='n1' value='v1'>", {n1: "v1"});
        testForm("<input type='checkbox' name='n2' value='v2'>", {});
        testForm("<input type='checkbox' name='n3' value='v3' checked>", {n3: "v3"});
        testForm("<input type='radio' name='n4' value='v4'>", {});
        testForm("<input type='radio' name='n5' value='v5' checked>", {n5: "v5"});
        testForm("<select name='n6'><option value='v6'></option><option value='v66' selected></option></select>", {n6: "v66"});
        testForm("<select name='n7' multiple><option value='v7' selected></option><option value='v77' selected></option></select>", {n7: ["v7", "v77"]});
        testForm("<select name='n8'><option selected>v8</option></select>", {n8: "v8"});
        testForm("<select name='n9' multiple><option value='v9' selected></option><option value='v99' selected><option value='v999' selected></option></select>", {n9: ["v9", "v99", "v999"]});
        testForm("<input type='hidden' name='n1' value='v1 v2'><input type='text' value='v2'>", {n1: "v1 v2"});
        testForm("<input type='checkbox' name='n10' value='1' checked><input type='checkbox' name='n10' value='2' checked><input type='checkbox' name='n10' value='3'>", {n10: ["1", "2"]});
    });

    describe("ignored form elements", function(){
        testForm("<input type='file' name='' value='123'>", {});
        testForm("<input type='file' name='t'>", {});
        testForm("<input type='submit' name='t'>", {});
        testForm("<input type='reset' name='t'>",  {});
        testForm("<input type='button' name='t'>", {});
        testForm("<button type='submit' name='t'></button>", {});
        testForm("<fieldset name='t'></fieldset>", {});
        // test("form>input[type=text name=a value=b]+(fieldset[disabled=disabled]>input[type=text name=c value=d])", {a: "b"});
        // test("form>input[type=text name=a value=b disabled]", {});
    });

    function testForm(html, value) {
        it(html, function() {
            var form = document.createElement("form");

            form.innerHTML = html;

            expect(XHR.serialize(form)).toEqual(value);
        });
    }
}); 
    
    
    
    
    
    
});