import { WINDOW } from "./const";
import { forOwn } from "./helpers";

//borrowed from lodash
function isObject(value) {
  var type = typeof value;
  return type === "function" || (value && type === "object") || false;
}

function identity(value) {
  return value;
}

var baseCreate = (function () {
  function UgmaObject() {}
  return function (prototype) {
    var result;
    if (isObject(prototype)) {
      UgmaObject.prototype = prototype;
      result = new UgmaObject();
      UgmaObject.prototype = null;
    }
    return result || WINDOW.Object();
  };
}());

function copy(source, object, props) {
  if (!props) {
    props = object;
    object = {};
  }
  var index = -1,
    length = props.length,
    key;

  while (++index < length) {
    key = props[index];
    object[key] = source[key];
  }
  return object;
}

export function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties ? copy(properties, result, Object.keys(properties)) : result;
}

export function extend(obj, extension, preserve) {
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
}