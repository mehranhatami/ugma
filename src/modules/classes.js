import { DOCUMENT, HTML, RETURN_FALSE, RETURN_THIS } from "../const";
import { implement, trim, is } from "../helpers";
import { minErr } from "../minErr";

/* es6-transpiler has-iterators:false, has-generators: false */
var reClass = /[\n\t\r]/g,
    whitespace = /\s/g;

implement({
    // Adds a class or an array of class names
    addClass: [RETURN_THIS, "add", (node, token) => {
        var existingClasses = (" " + node[0].className + " ")
            .replace(reClass, " ");

        if (existingClasses.indexOf(" " + token + " ") === -1) {
            existingClasses += trim(token) + " ";
        }

        node[0].className = trim(existingClasses);
    }],

    // Remove class(es) or an array of class names from element
    removeClass: [RETURN_THIS, "remove", (node, token) => {
        node[0].className = trim((" " + node[0].className + " ")
            .replace(reClass, " ")
            .replace(" " + trim(token) + " ", " "));
    }],

    // Check if element contains class name
    hasClass: [RETURN_FALSE, "contains", false, (node, token) => {
        return ((" " + node[0].className + " ")
            .replace(reClass, " ").indexOf(" " + token + " ") > -1);
    }],

    // Toggle the `class` in the class list. Optionally force state via `condition`
    toggleClass: [RETURN_FALSE, "toggle", (el, token) => {
        var hasClass = el.hasClass(token);

        if (hasClass) {
            el.removeClass(token);
        } else {
            el[0].className += " " + token;
        }

        return !hasClass;
    }]
}, (methodName, defaultStrategy, nativeMethodName, strategy) => {

    /* istanbul ignore else  */
    if (HTML.classList) {
        // use native classList property if possible
        strategy = function(el, token) {
            return el[0].classList[nativeMethodName](token);
        };
    }

    if (defaultStrategy === RETURN_FALSE) {
        return function(token, force) {
            if (typeof force === "boolean" && nativeMethodName === "toggle") {
                this[force ? "addClass" : "removeClass"](token);

                return force;
            }

            if (!is(token, "string")) minErr(nativeMethodName + "()", "The class provided is not a string.");



            return strategy(this, trim(token));
        };
    } else {

        return function() {
                var i = 0,
                    len = arguments.length;
                for (; i < len; i++) {    
                if (!is(arguments[i], "string")) minErr(nativeMethodName + "()", "The class provided is not a string.");
                if (whitespace.test(arguments[i])) minErr(methodName + "()", "The class provided contains HTML space " +
                            "characters, which are not valid.");
                strategy(this, arguments[i]);
            }

            return this;
        };
    }
}, (methodName, defaultStrategy) => defaultStrategy);