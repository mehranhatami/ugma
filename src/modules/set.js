import { implement, invoke, isArray, keys, each, is, forOwn } from "../helpers";
import { minErr } from "../minErr";
import { ERROR_MSG, GINGERBREAD, RETURN_THIS } from "../const";
import accessorhooks from "../util/accessorhooks";

implement({
    // Set property/attribute value by name
    set(name, value) {
        var node = this[0];

        // handle the value shortcut
        if (arguments.length === 1) {
            if (is(name, "function")) {
                value = name;
            } else {
                value = name == null ? "" : String(name);
            }

            if (value !== "[object Object]") {
                let tag = node.tagName;

                if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "OPTION") {
                    name = "value";
                } else {
                    name = "innerHTML";
                }
            }
        }

        var hook = accessorhooks.set[name],
            subscription = (this._["<%= prop('subscription') %>"] || {})[name],
            oldValue;

        if (subscription) {
            oldValue = this.get(name);
        }

        if (is(name, "string")) {
            if (name[0] === "_") {
                this._[name.slice(1)] = value;
            } else {
                if (is(value, "function")) {
                    value = value(this);
                }

                if (hook) {
                    hook(node, value);
                } else if (value == null) {
                    node.removeAttribute(name);
                } else if (name in node) {
                    node[name] = value;
                } else {
                    node.setAttribute(name, value);
                }
                /* istanbul ignore if */
                if (GINGERBREAD) {
                    // always trigger reflow manually for Android Gingerbread
                    node.className = node.className;
                }
            }
        } else if (isArray(name)) {
            each(name, (key) => {
                this.set(key, value);
            });
        } else if (is(name, "object")) {
            forOwn(name, (key, value) => {
                this.set(key, name[key]);
            });
        } else {
            minErr("set()", ERROR_MSG[6]);
        }

        if (subscription && oldValue !== value) {
            each(subscription, (w) => {
                invoke(this, w, value, oldValue);
            });
        }

        return this;
    }
}, null, () => RETURN_THIS);