(function(ugma) {

    "use strict";

    var Promise = window.Promise,
        contentType = "Content-Type",
        APPLICATION_JSON = "application/json",
        isArray = Array.isArray,
        keys = Object.keys,
        toString = Object.prototype.toString,
        isObject = function( obj ) {
            return toString.call( obj ) === "[object Object]"
        },
        toQueryString = function( params ) {
            // spaces should be + according to spec
            return params.join( "&" ).replace( /%20/g, "+" );
        },
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
                return XHR( method, url, options )
            }
        };

    if ( !window.ugma ) console.warn("ugma javascript Framework need to be included");

    if ( !Promise ) ugma.minErr( "XHR()", "In order to use XHR you have to include a Promise polyfill" );

    function isSuccess( status ) {
        return 200 <= status && status < 300 || 304;
    }

    // main XHR function
    function XHR( method, url ) {

        var options = arguments[ 2 ];

        if ( options === void 0 ) options = {};

        method = method.toUpperCase();

        var charset = "charset" in options ? options.charset : XHR.defaults.charset,
            mimeType = "mimeType" in options ? options.mimeType : XHR.defaults.mimeType,
            data = options.data,
            extraArgs = [],
            headers = {};

        // read default headers first
        keys( XHR.defaults.headers ).forEach( function(key) {
            headers[ key ] = XHR.defaults.headers[ key ];
        });

        // apply request specific headers
        keys( options.headers || {} ).forEach(function( key ) {
            headers[ key ] = options.headers[ key ];
        });

        if ( isObject( data ) ) {
            keys( data ).forEach(function( key ) {

                var enc = encodeURIComponent,
                    name = enc( key ),
                    value = data[ key ];

                if ( isArray( value ) ) {
                    value.forEach( function( value ) {
                        extraArgs.push( name + "=" + encodeURIComponent( value ) );
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

        if ( typeof data === "string" ) {
            if ( method === "GET" ) {
                extraArgs.push( data );

                data = null;
            } else {
                headers[ contentType ] = "application/x-www-form-urlencoded";
            }
        }

        if ( isObject( options.json ) ) {
            data = JSON.stringify( options.json );

            headers[ contentType ] = APPLICATION_JSON;
        }

        if ( contentType in headers ) {
            headers[ contentType ] += "; charset=" + charset;
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if ( options.emulateHTTP && (method === 'PUT' || method === 'DELETE' || method === 'PATCH' || method === 'POST' || method === 'GET' ) ) {
            extraArgs.push( options.emulateHTTP + "=" + method );
            headers[ "X-Http-Method-Override" ] = method;
            method = "POST";
        }

        if ( extraArgs.length ) {
            url += ( ~url.indexOf( "?" ) ? "&" : "?" ) + toQueryString( extraArgs );
        }

        // Make the request, allowing the user to override any Ajax options.
        var xhr = options.xhr || new XMLHttpRequest(),
            promise = new Promise( function( resolve, reject ) {
                var handleErrorResponse = function( message ) {
                    return function() {
                        reject( new Error(message ) )
                    }
                };

                xhr.open( method,
                    url,
                    true );

                xhr.timeout = options.timeout || XHR.defaults.timeout;

                if ( options.before ) options.before( xhr );

                // Set headers
                for ( var key in headers ) {

                    var headerValue = headers[ key ];

                    if ( headerValue != null ) {
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

                xhr.onabort = handleErrorResponse( "abort" );
                xhr.onerror = handleErrorResponse( "error" );
                xhr.ontimeout = handleErrorResponse( "timeout" );
                xhr.onreadystatechange = function() {

                    if ( xhr.readyState === 4 ) {
                        // by default parse response depending on Content-Type header
                        mimeType = mimeType || xhr.getResponseHeader( contentType ) || "";

                        // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                        var response = response = ( "response" in xhr ) ? xhr.response : xhr.responseText,
                            // Support: IE9
                            // sometimes IE returns 1223 when it should be 204
                            // http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
                            status = xhr.status === 1223 ? 204 : xhr.status,
                            // skip possible charset suffix
                            parseResponse = mimeTypeStrategies[mimeType.split( ";" )[ 0 ] ];

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

                xhr.send( data || null );
            });

        promise[ 0 ] = xhr;

        return promise;
    }
   /**
    * Set default values for future Ajax requests. Its use is not recommended.
    */
    XHR.defaults = {
        timeout: 15000,
        charset: "UTF-8",
        headers: {
            // X-Requested-With header
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    /* Expose */

    ugma.extend({
      
     /**
      * Perform an asynchronous HTTP (Ajax) request.
      */

      XHR: XHR,

     /**
      * XHR shortcuts
      */

      post: shortcuts( "post" ),
      get: shortcuts( "get" ),
      put: shortcuts( "put" ),
      delete: shortcuts( "delete" ),
      patch: shortcuts( "patch" ),
       
       /**
        * Encode a set of form elements as a string for submission.
        */
       
        serialize: function( node ) {

            var result = {};

            if ( "form" in node ) {
                node = [ node ];
            } else if ( "elements" in node ) {
                node = node.elements;
            } else {
                node = [];
            }

            var el, index = 0,
                length = node.length;

            for (; index < length;) {
                el = ( node[ index++ ] );

                var name = el.name;
                // don't serialize elements that are disabled or without a name
                if ( el.disabled || !name ) continue;

                switch ( el.type ) {
                    case "select-multiple":
                        result[ name ] = [];
                    case "select-one":

                        var option, opts = ( el.options );

                        for (index = 0, length = opts.length; index < length;) {
                            option = ( opts[ index++ ] );

                            if ( option.selected ) {
                                if ( name in result ) {
                                    result[ name ].push( option.value );
                                } else {
                                    result[ name ] = option.value;
                                }
                            }
                        };
                        break;

                    case undefined:
                    case "fieldset": // fieldset
                    case "file": // file input
                    case "image": // image input                    
                    case "submit": // submit button
                    case "reset": // reset button
                    case "button": // custom button
                        break;
                    case "textarea": // textarea
                       result[ name ].push( el.value.replace(/\r?\n/g, '\r\n') )
                    case "checkbox": // checkbox
                        if ( el.checked && result[ name ] ) {
                            if ( typeof result[ name ] === "string" ) {
                                result[ name ] = [ result[ name ] ];
                            }

                            result[ name ].push( el.value );

                            break;
                        }
                    case "radio": // radio button
                        if ( !el.checked ) break;
                    default:
                        result[ name ] = el.value;
                }
            };

            return result;
        }
    });

})( window.ugma );