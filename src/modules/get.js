import { minErr } from "../minErr";
import { implement, isArray, each, is } from "../helpers";
import { ERROR_MSG } from "../const";
import { dataAttr } from "../util/dataAttr";
import accessorhooks from "../util/accessorhooks";

implement({
    // Get property or attribute value by name
    get(name) {
        var node = this[0],
            hook = accessorhooks.get[name];

        // Grab necessary hook if it is defined
        if (hook) return hook(node, name);

        if (is(name, "string")) {
            if (/^data-/.test(name)) {
                return dataAttr(node, name);
            } else if (name in node) {
                return node[name];
                // get attribute
            } else {
                return node.getAttribute(name);
            }

        } else if (isArray(name)) {
            var obj = {};
            each(name, (key) => {
                obj[key] = this.get(key);
            });

            return obj;
        } else {
            minErr("get()", ERROR_MSG[4]);
        }
    }
}, null, () => function() {});