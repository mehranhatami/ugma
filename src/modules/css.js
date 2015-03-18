import { ERROR_MSG, RCSSNUM, INTERNET_EXPLORER, CHROME, ANDROID } from "../const";
import { implement, isArray, isSVG, computeStyle, is, map, forOwn, reduce } from "../helpers";
import { minErr } from "../minErr";
import cssHooks from "../util/csshooks";
import { adjustCSS } from "../util/adjustCSS";

 implement({
     // Get and set the style property on a DOM Node
     css(name, value) {
         var self = this,
             len = arguments.length,
             node = this[0],
             pseudoElement = value && value[0] === ":",
             style = node.style,
             computed;

         // Get CSS values
         // with support for pseudo-elements in getComputedStyle 
         if (pseudoElement || (len === 1 && (is(name, "string") || isArray(name)))) {
             let getValue = (name) => {
                 var getter = cssHooks.get[name] || cssHooks._default(name, style),

                     // if a 'pseudoElement' is present, don't change the original value. 
                     // The 'pseudoElement' need to be the second argument.
                     // E.g. link.css('color', ':before');
                     value = pseudoElement ? value : is(getter, "function") ? getter(style) : style[getter];

                 if (!value || pseudoElement) {
                     if (!computed) computed = computeStyle(node, pseudoElement ? value : "");

                     value = is(getter, "function") ? getter(computed) : computed[getter];
                 }

                 return value;
             };

             if (is(name, "string")) {

                 return getValue(name);

             } else {
                 return reduce(map(name, getValue), (memo, value, index) => {
                     memo[name[index]] = value;
                     return memo;
                 }, {});
             }
         }

         if (len === 2 && is(name, "string")) {
             var ret, setter = cssHooks.set[name] || cssHooks._default(name, style);

             if (is(value, "function")) {
                 value = value(this);
             }

             if (value == null) value = "";

             // Convert '+=' or '-=' to relative numbers
             if (value !== "" && (ret = RCSSNUM.exec(value)) && ret[1]) {

                 if (!computed) {
                     computed = computeStyle(node);
                 }

                 value = adjustCSS(this, setter, ret, computed);

                 if (ret && ret[3]) {
                     value += ret[3];
                 }
             }

             if (is(setter, "function")) {
                 setter(value, style);
             } else {
                 style[setter] = is(value, "number") ? value + "px" : value + ""; // cast to string; 
             }
         } else if (len === 1 && name && is(name, "object")) {
             forOwn(name, (key, value) => {
                 this.css(key, value);
             });
         } else {
             minErr("css()", ERROR_MSG[4]);
         }

         return this;
     }
 }, null, () => function(name) {
     if (arguments.length === 1 && isArray(name)) {
         return {};
     }
     if (arguments.length !== 1 || !is(name, "string")) {
         return this;
     }
 });