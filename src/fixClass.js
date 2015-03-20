// import { forOwn } from "./helpers";
"use strict";

var forOwn = function(){};

function newObject(proto, FN, args) {
  var obj = Object.create(proto);
  if (typeof FN === "function") {
    FN.apply(obj, args);
  }
  return obj;
}

function extend(obj, extension, preserve) {
  // failsave if something goes wrong
  if (!obj || !extension) return obj || extension || {};

  forOwn(extension, function(prop, func){
    // if preserve is set to true, obj will not be overwritten by extension if
    // obj has already a method key
    obj[prop] = (preserve === false && !(prop in obj)) ? func : func;

    if (preserve && extension.toString !== Object.prototype.toString) {
      obj.toString = extension.toString;
    }
  });
}

function fixClass(Base, constructorFN, info) {
  var proto = Object.create(Base && Base.prototype);

  extend(proto, info);

  function FN() {
    return newObject(proto, constructorFN, arguments);
  }

  if (typeof proto.new === "undefined") {
    proto.new = function () {
      //No need to use new keyword although you could use it
      return FN();
    };
  }

  FN.prototype = proto;
  proto.constructor = FN;
  return FN;
}

function fixClass2(Base, FN, info) {
  var proto = Object.create(Base && Base.prototype);

  extend(proto, info);

  if (typeof proto.new === "undefined") {
    proto.new = function () {
      return newObject(proto, FN, arguments);
    };
  }

  FN.prototype = proto;
  proto.constructor = FN;
  return FN;
}

var MyArray = fixClass(Array, function () {

});