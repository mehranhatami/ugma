/**
 * @module uClass
 */

import { forOwn, is } from "../helpers";

var uClass = () => {

    var len = arguments.length,
        mixin = arguments[ len - 1 ],
        SuperClass = len > 1 ? arguments[ 0 ] : null,
        Class, SuperClassEmpty,
        // helper for merging classes with each other
        extend = ( obj, extension, overwrite ) => {

            // failsave if something goes wrong
            if ( !obj || !extension) return obj || extension || {};

            if ( overwrite === false ) {

                forOwn( extension, ( prop, func ) => {
                    if ( !( prop in obj ) ) obj[ prop ] = func;
                });

            } else {

                forOwn( extension, ( prop, func ) => {
                    obj[ prop ] = func;
                });
            }
        };

    if ( is(mixin.constructor, "object") ) {
        Class = () => {};
    } else {
        Class = mixin.constructor;
        delete mixin.constructor;
    }

    if (SuperClass) {
        SuperClassEmpty = () => {};
        SuperClassEmpty.prototype = SuperClass.prototype;
        Class.prototype = new SuperClassEmpty();
        Class.prototype.constructor = Class;
        Class.Super = SuperClass;

        extend( Class, SuperClass, false );
    }
    extend( Class.prototype, mixin );

    return Class;
};

/*
 * Export interface
 */

export default uClass;