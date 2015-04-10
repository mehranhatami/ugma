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
XHR(method, url, config).then(success, fail);

```
# Configuration

* data
* json
* headers
* timeout
* before
* emulateHTTP
* mimetype

