import { forOwn } from "./helpers";

export function uClass() {
    let len = arguments.length,
        body = arguments[len - 1],
        SuperClass = len > 1 ? arguments[0] : null,
        Class, SuperClassEmpty,

        // helper for merging two object with each other
        extend = (obj, extension, preserve) => {

            // failsave if something goes wrong
            if (!obj || !extension) return obj || extension || {};

            forOwn(extension, (prop, func) => {
                // if preserve is set to true, obj will not be overwritten by extension if
                // obj has already a method key
                obj[prop] = (preserve === false && !(prop in obj)) ? func : func;

                if (preserve && extension.toString !== Object.prototype.toString) {
                    obj.toString = extension.toString;
                }
            });
        };

    if (body.constructor === Object) {
        Class = () => {};
    } else {
        Class = body.constructor;
        delete body.constructor;
    }

    if (SuperClass) {
        SuperClassEmpty = () => {};
        SuperClassEmpty.prototype = SuperClass.prototype;
        Class.prototype = new SuperClassEmpty();
        Class.prototype.constructor = Class;
        Class.Super = SuperClass;
        extend(Class, SuperClass, false);
    }

    extend(Class.prototype, body);

    return Class;
}