/**
 * @module uClass
 */

import { forOwn } from "../helpers";

var uClass = () => {
    var len = arguments.length,
        body = arguments[ len - 1 ],
        SuperClass = len > 1 ? arguments[ 0 ] : null,
        Class, SuperClassEmpty,
        extend = ( obj, extension ) => {

            // failsave if something goes wrong
            if( !obj || !extension ) return obj || extension || {};

            forOwn( extension, ( prop, func ) => {
                obj[ prop ] = func;
            });
        };

        if( body.constructor === "[object Object]" ) {
            Class = () => {};
        } else {
            Class = body.constructor;
            delete body.constructor;
        }

    if ( SuperClass ) {
        SuperClassEmpty = () => {};
        SuperClassEmpty.prototype = SuperClass.prototype;
        Class.prototype = new SuperClassEmpty();
        Class.prototype.constructor = Class;
        Class.Super = SuperClass;
        extend( Class, SuperClass, false );
    }

    extend(Class.prototype, body);

    return Class;
};

/*
 * Export interface
 */

export default uClass;