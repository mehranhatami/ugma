import { DOCUMENT, HTML, RETURN_FALSE, RETURN_THIS } from "../const";
import { implement, trim, is, convertArgs } from "../helpers";
import { minErr } from "../minErr";

/* es6-transpiler has-iterators:false, has-generators: false */

var reClass = /[\n\t\r]/g,
    whitespace = /\s/g,
    supportClassList = HTML.classList !== null,
    supportMultipleArgs = (function() {
        try {
            var div = DOCUMENT.createElement("div");
            div.classList.add("a", "b");
            return /(^| )a( |$)/.test(div.className) && /(^| )b( |$)/.test(div.className);
        } catch (err) {
            return false;
        }
    }());

implement({
    // Adds a class or an array of class names
    addClass: ["add", true, (node, token) => {
        var existingClasses = (" " + node[0].className + " ")
            .replace(reClass, " ");

        if (existingClasses.indexOf(" " + token + " ") === -1) {
            existingClasses += trim(token) + " ";
        }

        node[0].className = trim(existingClasses);
    }],

    // Remove class(es) or an array of class names from element
    removeClass: ["remove", true, (node, token) => {
        node[0].className = trim((" " + node[0].className + " ")
            .replace(reClass, " ")
            .replace(" " + trim(token) + " ", " "));
    }],

    // Check if element contains class name
    hasClass: ["contains", false, (node, token) => {
        return ((" " + node[0].className + " ")
            .replace(reClass, " ").indexOf(" " + token + " ") > -1);
    }],

    // Toggle the `class` in the class list. Optionally force state via `condition`
    toggleClass: ["toggle", false, (el, token) => {
        var hasClass = el.hasClass(token);

        if (hasClass) {
            el.removeClass(token);
        } else {
            el[0].className += " " + token;
        }

        return !hasClass;
    }]
}, (methodName, nativeMethodName, multiClass, strategy) => {

    /* istanbul ignore else  */
    if (supportClassList) {
        // use native classList property if possible
        strategy = function(el, token) {
            return el[0].classList[nativeMethodName](token);
        };
    }

    if (!multiClass) {
        return function(token, force) {
            if (typeof force === "boolean" && nativeMethodName === "toggle") {
                this[force ? "addClass" : "removeClass"](token);

                return force;
            }

            if (!is(token, "string")) minErr(nativeMethodName + "()", "The class provided is not a string.");

            return strategy(this, token);
        };
    } else {

        return function() {
            var tokens;
            if (multiClass && supportClassList && supportMultipleArgs) {
                tokens = convertArgs(arguments);
                // Throw if the token contains whitespace (e.g. 'hello world' or 'crazy mehran')
                if (whitespace.test(tokens)) {
                    minErr(nativeMethodName + "()", "The class provided contains HTML space " +
                        "characters, which are not valid.");
                }
                this[0].classList[nativeMethodName === "removeClass" ? "remove" : "add"].apply(this[0].classList, tokens);
            } else {
                tokens = arguments;
                for (var token of tokens) {
                    if (!is(token, "string")) minErr(nativeMethodName + "()", "The class provided is not a string.");

                    strategy(this, token);
                }
            }
            return this;
        };
    }
}, function(methodName, nativeMethodName) {
    if (nativeMethodName === "contains" ||
        nativeMethodName === "toggle") {
        return () => RETURN_FALSE;
    }
    return () => RETURN_THIS;
});