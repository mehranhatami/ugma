import { create, extend } from "./create";

function newObject(proto, Base, FN, args) {
  var obj = create(proto);
  if (typeof FN === "function") {
    FN.apply(obj, args);
  }
  return obj;
}

function fixClass(Base, constructorFN, info) {
  var proto = create(Base && Base.prototype);
  extend(proto, info);

  function FN(args) {
    return newObject(proto, Base, constructorFN, args);
  }

  FN.new = function () {
    return FN(arguments);
  };
  FN.prototype = proto;
  proto.constructor = FN;
  return FN;
}

function fixClass2(Base, FN, info) {
  var proto = create(Base && Base.prototype);
  extend(proto, info);

  FN.new = function () {
    return newObject(proto, FN, arguments);
  };

  FN.prototype = proto;
  proto.constructor = FN;
  return FN;
}

//It creates a new Function as the Class function itself
function firstSolution(){
  var MyArray = fixClass(Array, function () {

  }, {
    toString: function(){
      return "[Object MyArray]";
    }
  });

  var array = MyArray.new();

  array.push(11,22,33,44);

  return array;
}

//It doesn't createsa new Function for the Class, it just works on the existing function
function secondSolution(){
  var MyOtherArray = function(){

  };
  MyOtherArray.prototype.toString = function(){
    return "[Object MyOtherArray]";
  };

  fixClass2(Array, MyOtherArray, {
    getString: function(){
      return this.toString();
    }
  });

  var array = MyOtherArray.new();

  array.push(111,222,333,444);

  return array;
}