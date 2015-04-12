/**
 * XHR (ajax) for ugma javascript framework 0.0.6c
 * https://github.com/ugma/ugma
 * 
 * Copyright 2014 - 2015 Kenny Flashlight
 * Released under the MIT license
 * 
 * Build date: Sun, 12 Apr 2015 13:26:27 GMT
 */
(function() {
    "use strict";

    (function(window) {
    
        "use strict";
    
        /* es6-transpiler has-iterators:false, has-generators: false */
    
        var r20 = /%20/g,
            isArray = Array.isArray,
            keys = Object.keys,
            toString = Object.prototype.toString,
            isObject = function( obj )  {return toString.call( obj ) === "[object Object]"},
            toQueryString = function( params )  /* Return the resulting serialization */ {return params.join( "&" ).replace( r20, "+" )},
            mimeTypeShortcuts = { json: "application/json" },
            mimeTypeStrategies = {
                "application/json": function(text)  { return JSON.parse( text ) }
            },
            isSuccess = function( status )  {return status >= 200 && status < 300 || status === 304};
    
            if ( !window.Promise ) throw new Error( "The browser dows not support native Promises!!! You have to include a Promise polyfill" );
    
            /**
             * Perform an asynchronous HTTP (Ajax) request.
             */
    
           var XHR = function( method, url )  {
    
                var config = arguments[ 2 ];
    
                if ( config === void 0 ) config = {};
    
                method = method.toUpperCase();
    
                var async = "async" in config ? config.async : true,                
                    username = "username" in config ? config.username : null,                
                    password = "password" in config ? config.password : null,                                
                    charset = "charset" in config ? config.charset : XHR.options.charset,
                    mimeType = "mimeType" in config ? config.mimeType : XHR.options.mimeType,
                    data = config.data,
                    extraArgs = [],
                    headers = {};
    
                // read default headers first
                keys( XHR.options.headers ).forEach( function( key )  {
                    var value = XHR.options.headers[ key ];
                   if ( value != null ) headers[ key ] = value;
                });
    
                // apply request specific headers
                keys(config.headers || {} ).forEach( function(key )  {
                    headers[ key ] = config.headers[ key ];
                });
                
                // object
                if ( isObject( data ) ) {
                    keys( data ).forEach( function( key )  {
    
                        var enc = encodeURIComponent,
                            name = enc( key ),
                            value = data[ key ];
    
                        if ( isArray( value ) ) {
                            value.forEach( function( value )  {
                                extraArgs.push( name + "=" + enc( value ) );
                            });
                        } else {
                            extraArgs.push( name + "=" + enc( value ) );
                        }
                    });
    
                    if ( method === "GET" ) {
                        data = null;
                    } else {
                        data = toQueryString( extraArgs );
                        extraArgs = [];
                    }
                }
                
                 // string
                if ( typeof data === "string" ) {
                    if ( method === "GET" ) {
    
                        extraArgs.push( data );
                        data = null;
    
                    } else {
                        headers[ "Content-Type" ] = "application/x-www-form-urlencoded";
                    }
                }
    
                if ( isObject( config.json ) ) {
                    data = JSON.stringify( config.json );
    
                    headers[ "Content-Type" ] = "application/json";
                }
    
                if ( "Content-Type" in headers ) {
                    headers[ "Content-Type" ] += "; charset=" + charset;
                }
    
                // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
                // And an `X-HTTP-Method-Override` header.
                if ( config.emulateHTTP && ( method === "PUT" || method === "DELETE" || method === "PATCH" || method === "POST" || method === "GET" ) ) {
                    extraArgs.push( config.emulateHTTP + "=" + method );
                    headers[ "X-Http-Method-Override" ] = method;
                    method = "POST";
                }
    
                if ( extraArgs.length ) {
                    url += ( ~url.indexOf( "?" ) ? "&" : "?" ) + toQueryString( extraArgs );
                }
    
                var xhr = config.xhr || new window.XMLHttpRequest(),
                    promise = new window.Promise( function( resolve, reject )  {
    
                        // The response is always empty
                        // See https://xhr.spec.whatwg.org/#request-error-steps and https://fetch.spec.whatwg.org/#concept-network-error
                        var handleErrorResponse = function( message )  {return function()  {
                            reject( new Error(message ) );
                        }};
    
                        xhr.onabort = handleErrorResponse( "abort" );
                        xhr.onerror = handleErrorResponse( "error" );
                        xhr.ontimeout = handleErrorResponse( "timeout" );
                        xhr.onload = function()  {
                            
                            if ( xhr.readyState === 4 ) {
                                // by default parse response depending on Content-Type header
                                mimeType = mimeType || xhr.getResponseHeader( "Content-Type" ) || "";
    
                                // responseText is the old-school way of retrieving response (supported by 9)
                                // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                                var response = ( "response" in xhr ) ? xhr.response : xhr.responseText,
                                    // Support: IE9
                                    // sometimes IE returns 1223 when it should be 204
                                    // http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
                                    status = xhr.status === 1223 ? 204 : xhr.status,
                                    // skip possible charset suffix
                                    parseResponse = mimeTypeStrategies[ mimeType.split(";")[ 0 ] ];
    
                                if ( parseResponse ) {
                                    try {
                                        // when strategy found - parse response according to it
                                        response = parseResponse( response );
                                    } catch ( err ) {
                                        return reject( err );
                                    }
                                }
    
                                if ( isSuccess( status ) ) {
                                    resolve( response );
                                } else {
                                    reject( response );
                                }
                            }
                        };
    
                        xhr.open(
                            method,
                            url,
                            async,
                            username,
                            password
                        );
                        
                        xhr.timeout = config.timeout || XHR.options.timeout;
    
                        // beforeSend 
                        if (XHR.options.beforeSend) XHR.options.beforeSend( xhr );
    
                        // Set headers
                        for (var key in headers) {
    
                            var headerValue = headers[ key ];
    
                            if (headerValue != null) {
                                xhr.setRequestHeader( key, String( headerValue ) );
                            }
                        }
    
                        // Override mime type if needed
                        if ( mimeType ) {
                            if ( mimeType in mimeTypeShortcuts ) {
                                xhr.responseType = mimeType;
                                mimeType = mimeTypeShortcuts[ mimeType ];
                            } else if ( xhr.overrideMimeType ) {
                                xhr.overrideMimeType( mimeType );
                            }
                        }
    
                        xhr.send( data || null );
                    } );
    
                promise[ 0 ] = xhr;
    
                return promise;
            };
    
        /**
         * Encode a set of form elements as a string for submission.
         */
    
        XHR.serialize = function(node)  {var $D$0;var $D$1;var $D$2;var $D$3;var $D$4;
            var result = {};
    
            if ("form" in node) {
                node = [ node ];
            } else if ( "elements" in node ) {
                node = node.elements;
            } else {
                node = [];
            }
    
            $D$0 = 0;$D$1 = node.length;for (var el ;$D$0 < $D$1;){el = (node[$D$0++]);
                var name = el.name;
                // don't serialize elements that are disabled or without a name
                if ( el.disabled || !name ) continue;
    
                switch ( el.type ) {
                    case "select-multiple":
                        result[name] = [];
                        /* falls through */
                    case "select-one":
                        $D$4 = (el.options);$D$2 = 0;$D$3 = $D$4.length;for ( var option ;$D$2 < $D$3;){option = ($D$4[$D$2++]);
                            if ( option.selected ) {
                                if ( name in result ) {
                                    result[ name ].push( option.value );
                                } else {
                                    result[ name ] = option.value;
                                }
                            }
                        };$D$2 = $D$3 = $D$4 = void 0;
                        break;
    
                    case undefined:
                    case "fieldset": // fieldset
                    case "file": // file input
                    case "submit": // submit button
                    case "reset": // reset button
                    case "button": // custom button
                        break;
                    case "textarea": // textarea
                        result[ name ].push(el.value.replace(/\r?\n/g, "\r\n") );
                        break;
                    case "checkbox": // checkbox
                        if ( el.checked && result[ name ] ) {
                            if (typeof result[ name ] === "string" ) {
                                result[ name ] = [ result[name ] ];
                            }
    
                            result[ name ].push( el.value );
    
                            break;
                        }
                        /* falls through */
                    case "radio": // radio button
                        if (!el.checked) break;
                        /* falls through */
                    default:
                        result[ name ] = el.value;
                }
            };$D$0 = $D$1 = void 0;
    
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
    
        [ "get", "post", "put", "delete", "patch" ].forEach( function( method )  {
            XHR[ method ] = function( url, config )  {return XHR( method, url, config )};
        });
    
    
        /* Expose */
        window.XHR = XHR;
    
    })(window);
})();
