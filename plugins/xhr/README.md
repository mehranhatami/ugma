# XHR

Lightweight, ES6-promised based implementation for working with AJAX.

# API

XHR supports ES6 promises, and following API methods:

* post
* get
* put
* delete
* patch

```javascript

ugma.XHR.get("/foo/url").then(function(response) {
    // do something with response
});

// shortcuts

ugma.post("/test/modify/url", {data: {a: "b"}}).then(successCallback, errorCallback);

// or general method
ugma.XHR(method, url, config).then(success, fail);

```
# Configuration

* data - Specifies data that you want to send in AJAX request.
* json -   Specifies JSON data for AJAX request.
* headers
* timeout -  The argument specifies request timeout in miliseconds.
* before - function to be executed before the AJAX request are sent
* emulateHTTP -  Truthy value specifies name of the extra URL parameter to emulate additional HTTP methods for older servers.
*mimeType -  Used to specify returned data type and to override value of the Content-Type header which is used by default to understand how to parse response.

