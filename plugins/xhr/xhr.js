/* globals window, document */

(function(ugma) {

    "use strict"; /* es6-transpiler has-iterators:false, has-generators: false */

    var Promise = window.Promise,
        contentType = "Content-Type",
        APPLICATION_JSON = "application/json",
        isArray = Array.isArray,
        keys = Object.keys,
        toString = Object.prototype.toString,
        HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"],
        isObject = (o) => toString.call(o) === "[object Object]",
        toQueryString = (params) => params.join("&").replace(/%20/g, "+"),
        mimeTypeShortcuts = {
            json: APPLICATION_JSON
        },
        mimeTypeStrategies = {
            "application/json": function( text ) {
                return JSON.parse( text );
            }
        },
        shortcuts = function( method ) {
            return function( url, options ) {
                return XHR( method, url, options );
            };
        };

//    if ( !window.ugma ) console.warn("ugma javascript Framework need to be included");

    if ( !Promise ) ugma.minErr( "XHR()", "In order to use XHR you have to include a Promise polyfill" );

    function isSuccess( status ) {
     return status >= 200 && status < 300 || status === 304;
    }

    // main XHR function

    var XHR = function XHR(method, url, config = {}) {
        method = method.toUpperCase();

        var charset = "charset" in config ? config.charset : XHR.options.charset,
            mimeType = "mimeType" in config ? config.mimeType : XHR.options.mimeType,
            data = config.data,
            extraArgs = [],
            headers = {};

        // read default headers first
        Object.keys(XHR.options.headers).forEach((key) => {
            headers[key] = XHR.options.headers[key];
        });

        // apply request specific headers
        Object.keys(config.headers || {}).forEach((key) => {
            headers[key] = config.headers[key];
        });

        if (isObject(data)) {
            Object.keys(data).forEach((key) => {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (Array.isArray(value)) {
                    value.forEach((value) => {
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

        if (isObject(config.json)) {
            data = JSON.stringify(config.json);

            headers[contentType] = APPLICATION_JSON;
        }

        if (contentType in headers) {
            headers[contentType] += "; charset=" + charset;
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if ( config.emulateHTTP && (method === "PUT" || method === "DELETE" || method === "PATCH" || method === "POST" || method === "GET" ) ) {
            extraArgs.push(config.emulateHTTP + "=" + method);
            headers["X-Http-Method-Override"] = method;
            method = "POST";
        }

        if (extraArgs.length) {
            url += (~url.indexOf("?") ? "&" : "?") + toQueryString(extraArgs);
        }

        var xhr = config.xhr || new window.XMLHttpRequest(),
            promise = new Promise((resolve, reject) => {
                var handleErrorResponse = (message) => () => { reject(new Error(message)) };

                xhr.onabort = handleErrorResponse("abort");
                xhr.onerror = handleErrorResponse("error");
                xhr.ontimeout = handleErrorResponse("timeout");
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        // by default parse response depending on Content-Type header
                        mimeType = mimeType || xhr.getResponseHeader(contentType) || "";

                         // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                        var response = ( "response" in xhr ) ? xhr.response : xhr.responseText,
                            // Support: IE9
                            // sometimes IE returns 1223 when it should be 204
                            // http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
                            status = xhr.status === 1223 ? 204 : xhr.status,
                            // skip possible charset suffix
                            parseResponse = mimeTypeStrategies[mimeType.split( ";" )[ 0 ] ];

                        if (parseResponse) {
                            try {
                                // when strategy found - parse response according to it
                                response = parseResponse(response);
                            } catch (err) {
                                return reject(err);
                            }
                        }

                        if ( isSuccess( status ) ) {
                            resolve( response );
                        } else {
                            reject( response );
                        }
                    }
                };

                xhr.open(method, url, true);
                xhr.timeout = config.timeout || XHR.options.timeout;
//                if ( XHR.options.before ) XHR.options.before( xhr );
                
                // Set headers
                for ( var key in headers ) {

                    var headerValue = headers[ key ];

                    if ( headerValue != null ) {
                        xhr.setRequestHeader( key, String( headerValue ) );
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

                xhr.send( data || null );
            });

        promise[0] = xhr;

        return promise;
    };

    // define shortcuts
    HTTP_METHODS.forEach((method) => {
        XHR[method.toLowerCase()] = (url, config) => XHR(method, url, config);
    });

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

            if (el.disabled || !name) continue;

            switch(el.type) {
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

            case "checkbox": // checkbox
                if (el.checked && result[name]) {
                    if (typeof result[name] === "string") {
                        result[name] = [ result[name] ];
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
        headers: { "X-Requested-With": "XMLHttpRequest" }
    };

  
/* Expose */
   window.XHR = XHR;

})( window.ugma );
