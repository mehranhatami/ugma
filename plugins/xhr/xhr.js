/* globals window, document */
(function(window) {

    "use strict";

    /* es6-transpiler has-iterators:false, has-generators: false */

    var Promise = window.Promise,
        isArray = Array.isArray,
        keys = Object.keys,
        toString = Object.prototype.toString,
        isObject = (obj) => toString.call(obj) === "[object Object]",
        toQueryString = (params) => params.join("&").replace(/%20/g, "+"),
        mimeTypeShortcuts = {
            json: "application/json"
        },
        mimeTypeStrategies = {
            "application/json": function(text) {
                return JSON.parse(text);
            }
        };

        if (!window.Promise) throw new Error("The browser dows not support native Promises!!! You have to include a Promise polyfill");

       var isSuccess = (status) => {
            return status >= 200 && status < 300 || status === 304;
        },

        /**
         * Perform an asynchronous HTTP (Ajax) request.
         */

        XHR = (method, url) => {

            var config = arguments[2];

            if (config === void 0) config = {};

            method = method.toUpperCase();

            var charset = "charset" in config ? config.charset : XHR.options.charset,
                mimeType = "mimeType" in config ? config.mimeType : XHR.options.mimeType,
                data = config.data,
                extraArgs = [],
                headers = {};

            // read default headers first
            keys(XHR.options.headers).forEach((key) => {
                headers[key] = XHR.options.headers[key];
            });

            // apply request specific headers
            keys(config.headers || {}).forEach((key) => {
                headers[key] = config.headers[key];
            });

            if (isObject(data)) {
                keys(data).forEach((key) => {

                    var enc = encodeURIComponent,
                        name = enc(key),
                        value = data[key];

                    if (isArray(value)) {
                        value.forEach((value) => {
                            extraArgs.push(name + "=" + enc(value));
                        });
                    } else {
                        extraArgs.push(name + "=" + enc(value));
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
                    headers["Content-Type"] = "application/x-www-form-urlencoded";
                }
            }

            if (isObject(config.json)) {
                data = JSON.stringify(config.json);

                headers["Content-Type"] = "application/json";
            }

            if ("Content-Type" in headers) {
                headers["Content-Type"] += "; charset=" + charset;
            }

            // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
            // And an `X-HTTP-Method-Override` header.
            if (config.emulateHTTP && (method === "PUT" || method === "DELETE" || method === "PATCH" || method === "POST" || method === "GET")) {
                extraArgs.push(config.emulateHTTP + "=" + method);
                headers["X-Http-Method-Override"] = method;
                method = "POST";
            }

            if (extraArgs.length) {
                url += (~url.indexOf("?") ? "&" : "?") + toQueryString(extraArgs);
            }

            var xhr = config.xhr || new window.XMLHttpRequest(),
                promise = new window.Promise( (resolve, reject) => {
                    var handleErrorResponse = (message) => () => {
                        reject(new Error(message));
                    };

                    xhr.onabort = handleErrorResponse("abort");
                    xhr.onerror = handleErrorResponse("error");
                    xhr.ontimeout = handleErrorResponse("timeout");
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            // by default parse response depending on Content-Type header
                            mimeType = mimeType || xhr.getResponseHeader("Content-Type") || "";

                            // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                            // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                            var response = ("response" in xhr) ? xhr.response : xhr.responseText,
                                // Support: IE9
                                // sometimes IE returns 1223 when it should be 204
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

                    xhr.open(method, url, true);
                    xhr.timeout = config.timeout || XHR.options.timeout;

                    // before 
                    if (XHR.options.before) XHR.options.before(xhr);

                    // Set headers
                    for (var key in headers) {

                        var headerValue = headers[key];

                        if (headerValue != null) {
                            xhr.setRequestHeader(key, String(headerValue));
                        }
                    }

                    // Override mime type if needed
                    if (mimeType) {
                        if (mimeType in mimeTypeShortcuts) {
                            xhr.responseType = mimeType;
                            mimeType = mimeTypeShortcuts[mimeType];
                        } else if (xhr.overrideMimeType) {
                            xhr.overrideMimeType(mimeType);
                        }
                    }

                    xhr.send(data || null);
                });

            promise[0] = xhr;

            return promise;
        };

    /**
     * Encode a set of form elements as a string for submission.
     */

    XHR.serialize = (node) => {
        var result = {};

        if ("form" in node) {
            node = [node];
        } else if ("elements" in node) {
            node = node.elements;
        } else {
            node = [];
        }

        for (let el of node) {
            var name = el.name;
            // don't serialize elements that are disabled or without a name
            if (el.disabled || !name) continue;

            switch (el.type) {
                case "select-multiple":
                    result[name] = [];
                    /* falls through */
                case "select-one":
                    for (let option of el.options) {
                        if (option.selected) {
                            if (name in result) {
                                result[name].push(option.value);
                            } else {
                                result[name] = option.value;
                            }
                        }
                    }
                    break;

                case undefined:
                case "fieldset": // fieldset
                case "file": // file input
                case "submit": // submit button
                case "reset": // reset button
                case "button": // custom button
                    break;
                case "textarea": // textarea
                    result[name].push(el.value.replace(/\r?\n/g, "\r\n"));
                    break;
                case "checkbox": // checkbox
                    if (el.checked && result[name]) {
                        if (typeof result[name] === "string") {
                            result[name] = [result[name]];
                        }

                        result[name].push(el.value);

                        break;
                    }
                    /* falls through */
                case "radio": // radio button
                    if (!el.checked) break;
                    /* falls through */
                default:
                    result[name] = el.value;
            }
        }

        return result;
    };

    /**
     * Set default values for future Ajax requests. Its use is not recommended.
     */

    XHR.options = {
        timeout: 15000,
        charset: "UTF-8",
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    /**
     * XHR shortcuts
     */

    ["GET", "POST", "PUT", "DELETE", "PATCH"].forEach((method) => {
        XHR[method.toLowerCase()] = (url, config) => XHR(method, url, config);
    });


    /* Expose */
    window.XHR = XHR;

})(window);