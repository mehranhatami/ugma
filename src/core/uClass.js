/**
 * @module uClass
 */

import { forOwn } from "../helpers";


var uClass = () => {

    var len = arguments.length,
        body = arguments[len - 1],
        SuperClass = len > 1 ? arguments[0] : null,
        hasImplementClasses = len > 2,
        Class, SuperClassEmpty,
        extend = (obj, extension, override) => {
            var prop;
            if (override === false) {
                for (prop in extension)
                    if (!(prop in obj))
                        obj[prop] = extension[prop];
            } else {
                for (prop in extension)
                    obj[prop] = extension[prop];
                if (extension.toString !== Object.prototype.toString)
                    obj.toString = extension.toString;
            }
        },
        extendClass = (Class, extension, override) => {
            extend(Class.prototype, extension, override);
        };

    if (body.constructor === Object) {
        Class = function() {};
    } else {
        Class = body.constructor;
        delete body.constructor;
    }

    if (SuperClass) {
        SuperClassEmpty = function() {};
        SuperClassEmpty.prototype = SuperClass.prototype;
        Class.prototype = new SuperClassEmpty();
        Class.prototype.constructor = Class;
        Class.Super = SuperClass;
        extend(Class, SuperClass, false);
    }

    if (hasImplementClasses)
        for (var i = 1; i < len - 1; i++)
            extend(Class.prototype, arguments[i].prototype, false);

    extendClass(Class, body);

    return Class;
};

/*
 * Export interface
 */

export default uClass;