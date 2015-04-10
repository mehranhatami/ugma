(function(window) {

    "use strict";

    var Promise = window.Promise,
        contentType = "Content-Type",
        APPLICATION_JSON = "application/json",
        isArray = Array.isArray,
        keys = Object.keys,
        toString = Object.prototype.toString,
        isObject = function(o) {
            return toString.call(o) === "[object Object]"
        },
        toQueryString = function(params) {
            return params.join("&").replace(/%20/g, "+")
        },
        mimeTypeShortcuts = {
            json: APPLICATION_JSON
        },
        mimeTypeStrategies = {};

    mimeTypeStrategies[APPLICATION_JSON] = function(text) {
        return JSON.parse(text)
    };

    function isSuccess(status) {
        return 200 <= status && status < 300 || 304;
    }

    function XHR(method, url) {
        var options = arguments[2];
        if (options === void 0) options = {};
        method = method.toUpperCase();

        var charset = "charset" in options ? options.charset : XHR.defaults.charset,
            mimeType = "mimeType" in options ? options.mimeType : XHR.defaults.mimeType,
            data = options.data,
            extraArgs = [],
            headers = {};

        // read default headers first
        keys(XHR.defaults.headers).forEach(function(key) {
            headers[key] = XHR.defaults.headers[key];
        });

        // apply request specific headers
        keys(options.headers || {}).forEach(function(key) {
            headers[key] = options.headers[key];
        });

        if (isObject(data)) {
            keys(data).forEach(function(key) {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (isArray(value)) {
                    value.forEach(function(value) {
                        extraArgs.push(name + "=" + encodeURIComponent(value));
                    });
                } else {
                    extraArgs.push(name + "=" + encodeURIComponent(value));
                }
            });

            if (method === "GET") {
                data = null;
            } else {
                data = toQueryString(extraArgs);
                extraArgs = [];
            }
        }

        if (typeof data === "string") {
            if (method === "GET") {
                extraArgs.push(data);

                data = null;
            } else {
                headers[contentType] = "application/x-www-form-urlencoded";
            }
        }

        if (isObject(options.json)) {
            data = JSON.stringify(options.json);

            headers[contentType] = APPLICATION_JSON;
        }

        if (contentType in headers) {
            headers[contentType] += "; charset=" + charset;
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (options.emulateHTTP && (method === 'PUT' || method === 'DELETE' || method === 'PATCH' || method === 'POST' || method === 'GET')) {
            extraArgs.push(options.emulateHTTP + "=" + method);
            headers["X-Http-Method-Override"] = method;
            method = "POST";
        }

        if (extraArgs.length) {
            url += (~url.indexOf("?") ? "&" : "?") + toQueryString(extraArgs);
        }
       
        // Make the request, allowing the user to override any Ajax options.
        var xhr = options.xhr = new XMLHttpRequest(),
            promise = new Promise(function(resolve, reject) {
                var handleErrorResponse = function(message) {
                    return function() {
                        reject(new Error(message))
                    }
                };

                xhr.open(method, url, true);
                xhr.timeout = options.timeout || XHR.defaults.timeout;

                // set request headers
                keys(headers).forEach(function(key) {

                    var headerValue = headers[key];

                    if (headerValue != null) {
                        xhr.setRequestHeader(key, String(headerValue));
                    }
                });

                // set mime type
                if (mimeType) {
                    if (mimeType in mimeTypeShortcuts) {
                        xhr.responseType = mimeType;
                        mimeType = mimeTypeShortcuts[mimeType];
                    } else if (xhr.overrideMimeType) {
                        xhr.overrideMimeType(mimeType);
                    }
                }

                xhr.onabort = handleErrorResponse("abort");
                xhr.onerror = handleErrorResponse("error");
                xhr.ontimeout = handleErrorResponse("timeout");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        // by default parse response depending on Content-Type header
                        mimeType = mimeType || xhr.getResponseHeader(contentType) || "";

                        // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                        var response = response = ('response' in xhr) ? xhr.response : xhr.responseText,
                            // http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
                            status = xhr.status === 1223 ? 204 : xhr.status,
                            // skip possible charset suffix
                            parseResponse = mimeTypeStrategies[mimeType.split(";")[0]];

                        if (parseResponse) {
                            try {
                                // when strategy found - parse response according to it
                                response = parseResponse(response);
                            } catch (err) {
                                return reject(err);
                            }
                        }

                        if (isSuccess(status)) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                    }
                };

                xhr.send(data || null);
            });

        promise[0] = xhr;

        return promise;
    }

    // define shortcuts
    ["get", "post", "put", "delete", "patch"].forEach(function(method) {
        XHR[method] = function(url, options) {
            return XHR(method, url, options)
        };
    });

    // useful defaults
    XHR.defaults = {
        timeout: 15000,
        charset: "UTF-8",
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    if (Promise) {
        // expose namespace globally
        window.XHR = XHR;
    } else {
        throw new Error("In order to use XHR you have to include a Promise polyfill");
    }
})(window);