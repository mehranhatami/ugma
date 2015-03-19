import { minErr } from "../minErr";
import { implement, isArray, reduce, is } from "../helpers";
import { ERROR_MSG } from "../const";
import PROP from "../util/accessorhooks";

var multiDash = /([A-Z])/g,
    dataAttr = (node, key) => {
        // convert from camel case to dash-separated value
        key = "data-" + key.replace(multiDash, "-$1").toLowerCase();

        var value = node.getAttribute(key),
            parseJSON = (value)  => {
                try {
                    value = JSON.parse(value);
                } catch (err) {}
                return value;
            };

        if (value != null) {

				value = value === "true" ? true :
					value === "false" ? false :
					value === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+value + "" === value ? +value :
 			        // try to recognize and parse object notation syntax
            		value[0] === "{" && value[value.length - 1] === "}" ? parseJSON(value) :
					value;
        }

        return value;
    };

implement({
    // Get property or attribute value by name
    get(name) {
        var node = this[0],
            hook = PROP.get[name];
        // use 'hook' if it exist
        if (hook) return hook(node, name);

        if (is(name, "string")) {
            if (name in node) {
                return node[name];
                // if no private data storage   
            } else if (name[0] !== "_") {
                return node.getAttribute(name);
            } else {
                // remove '_' from the name
                let key = name.slice(1),
                    data = this._;
                // If no data was found internally, try to fetch any
                // data from the HTML5 data-* attribute
                if (!(key in data)) {
                    data[key] = dataAttr(node, key);
                }

                return data[key];
            }
        } else if (isArray(name)) {
            return reduce(name, (memo, key) => {
                return memo[key] = this.get(key), memo;
            }, {});
        } else {
            minErr("get()", ERROR_MSG[4]);
        }
    }
}, null, () => function() {});