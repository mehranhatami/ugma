import { trim, each, every } from "../helpers";
import { INTERNET_EXPLORER, DOCUMENT, FOCUSABLE } from "../const";

var langFix = /_/g,
    accessorHooks = {

        get: {

            style: (node) => node.style.cssText,
            title: (node) => {
                var doc = node.ownerDocument;

                return (node === doc.documentElement ? doc : node).title;
            },
            option: (node) => trim(node.value),
            select: (node) => ~node.selectedIndex ? node.options[node.selectedIndex].value : "",
            undefined: (node) => {
                switch (node.tagName) {
                    case "SELECT":
                        return ~node.selectedIndex ? node.options[node.selectedIndex].value : "";
                    case "OPTION":
                        // Support: IE<11
                        // option.value not trimmed
                        return trim(node[node.hasAttribute("value") ? "value" : "text"]);
                    default:
                        return node[node.type && "value" in node ? "value" : "innerHTML"];
                }
            },
            type: (node) => node.getAttribute("type") || node.type
        },

        set: {
            lang: (node, value) => {
                // correct locale browser language before setting the attribute             
                // e.g. from zh_CN to zh-cn, from en_US to en-us
                node.setAttribute("lang", value.replace(langFix, "-").toLowerCase());
            },

            style: (node, value) => {
                node.style.cssText = value;
            },
            title: (node, value) => {
                var doc = node.ownerDocument;

                (node === doc.documentElement ? doc : node).title = value;
            },
            value: (node, value) => {
                if (node.tagName === "SELECT") {
                    // selectbox has special case
                    if (every.call(node.options, (o) => !(o.selected = o.value === value))) {
                        node.selectedIndex = -1;
                    }
                } else {
                    // for IE use innerText for textareabecause it doesn't trigger onpropertychange
                    node.value = value;
                }
            }
        }
    };

// Support: IE<=11+    
(function() {
    var input = DOCUMENT.createElement("input");

    input.type = "checkbox";

    // Support: Android<4.4
    // Default value for a checkbox should be "on"
    if (input.value !== "") {
        accessorHooks.get.checked = (node) => {
            return node.getAttribute("value") === null ? "on" : node.value;
        };
    }
    // Support: IE<=11+
    // An input loses its value after becoming a radio
    input = DOCUMENT.createElement("input");
    input.value = "t";
    input.type = "radio";

    // Setting the type on a radio button after the value resets the value in IE9
    if (input.value !== "t") {

        accessorHooks.set.type = (node, value) => {
            if (value === "radio" &&
                node.nodeName === "INPUT") {
                var val = node.value;
                node.setAttribute("type", value);
                if (val) {
                    node.value = val;
                }
                return value;
            } else {
                node.type = value;
            }
        };
    }
    input = null;
}());

each(("multiple selected checked disabled readOnly required open").split(" "), function(key) {
        // For Boolean attributes we need to give them a special treatment, and set 
        // the corresponding property to either true or false
        accessorHooks.set[key.toLowerCase()] = (node, value) => {

            if (!!value) {
                node[key] = true;
                node.setAttribute(key, value);
            } else {
                node[key] = false;
                node.removeAttribute(value);
            }
        };
    });

// fix hidden attribute for IE9
if (INTERNET_EXPLORER === 9) {
    accessorHooks.set.hidden = (node, value) => {
        node.hidden = value;
        node.setAttribute("hidden", "hidden");
        // trigger redraw in IE9
        node.style.zoom = "1";
    };
}

// properties written as camelCase
each(("tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap dateTime " +
    "frameBorder contentEditable valueType defaultValue accessKey encType readOnly vAlign longDesc").split(" "), function(key) {
        accessorHooks.get[key.toLowerCase()] = (node) => node[key];
});

/*
    // Use a 'hook' for innerHTML because of Win8 apps
    accessorHooks.set.innerHTML = (node, value) => {
        // Win8 apps: Allow all html to be inserted
        if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
            MSApp.execUnsafeLocalFunction(function() {
                node.innerHTML = value;
            });
        }
        node.innerHTML = value;
    };*/

export default accessorHooks;