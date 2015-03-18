import { forOwn } from "./helpers";

export function uClass() {
    var len = arguments.length,
        body = arguments[len - 1],
        SuperClass = len > 1 ? arguments[0] : null,
        Class, SuperClassEmpty,
        extend = function(obj, extension, override) {
            if (override === false) {
                forOwn(extension, (prop, func) => {
                    if (!(prop in obj)) {
                        obj[prop] = func;
                    }
                });
            } else {
                forOwn(extension, (prop, func) => {
                    obj[prop] = func;
                });
            }
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