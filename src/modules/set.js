import { implement, invoke, isArray, each, is, forOwn } from "../helpers";
import { minErr } from "../minErr";
import { ERROR_MSG, RETURN_THIS } from "../const";
import accessorhooks from "../util/accessorhooks";
function getTagName(node) {
    var tag = node.tagName;
    return (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION");
}

implement({
    // Set property/attribute value by name
    set(prop, value) {

        var node = this[0];

        if (arguments.length === 1) {
            if (is(prop, "function")) {
                value = prop;
            } else {
                value = prop == null ? "" : prop + "";
            }

            if (value !== "[object Object]") {

                if (getTagName(node)) {
                    prop = "value";
                } else {
                    prop = "innerHTML";
                }
            }
        }

        var hook = accessorhooks.set[prop],
            subscription = (this._._subscription || {})[prop],
            previousValue;

        // grab the previous value if it's already a subscription on this attribute / property,
        if (subscription) {
            previousValue = this.get(prop);
        }

        if (is(prop, "string")) {
            if (is(value, "function")) {
                value = value(this);
            }

            if (hook) {
                hook(node, value);
            } else if (value == null) {
                node.removeAttribute(prop);
            } else if (prop in node) {
                node[prop] = value;
            } else {
                node.setAttribute(prop, value);
            }
            // set array of key values
            // e.g. link.set(["autocomplete", "autocorrect"], "off");
        } else if (isArray(prop)) {
            each(prop, (key) => { this.set(key, value) });
            // set a object with key-value pairs    
            // e.g.   link.set({"data-foo1": "bar1", "data-foo2": "bar2" });
        } else if (is(prop, "object")) {
            forOwn(prop, (key, value) => { this.set(key, prop[key]) });
        } else {
            minErr("set()", ERROR_MSG[6]);
        }

        if (subscription && previousValue !== value) {
            // Trigger all relevant attribute / property changes.
            each(subscription, (w) => {
                invoke(this, w, value, previousValue);
            });
        }

        return this;
    }
}, null, () => RETURN_THIS);