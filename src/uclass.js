var extend = function(obj, extension, override) {
    var prop;
    if (override === false) {
        for (prop in extension)
            if (!(prop in obj))
                obj[prop] = extension[prop];
    } else {
        for (prop in extension)
            obj[prop] = extension[prop];
    }
};

export function uClass() {
    var len = arguments.length,
        body = arguments[len - 1],
        SuperClass = len > 1 ? arguments[0] : null,
        Class, SuperClassEmpty;

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

    extend(Class.prototype, body);

    return Class;
}