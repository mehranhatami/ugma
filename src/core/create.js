import { WINDOW } from "../const";
import { copy  } from "../helpers";

function isObject(value) {
  var type = typeof value;
  return type === "function" || (value && type === "object") || false;
}
var baseCreate = (() => {
  function UgmaObject() {}
  return (prototype) => {
    var result;
    if (isObject(prototype)) {
      UgmaObject.prototype = prototype;
      result = new UgmaObject();
      UgmaObject.prototype = null;
    }
    return result || WINDOW.Object();
  };
}());

export function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties ? copy(properties, result) : result;
}