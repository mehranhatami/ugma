import { implement, forOwn, is, isArray } from "../helpers";
import { minErr } from "../minErr";
import { RETURN_THIS } from "../const";
import { dataAttr } from "../util/dataAttr";

implement({
    // Getter/setter of a data entry value. Tries to read the appropriate
    // HTML5 data-* attribute if it exists
    data(key, value) {

            var node = this[0];

            var len = arguments.length;
            if (len === 1) {
                if (is(key, "string")) {

                    var data = this._;
                    // If no data was found internally, try to fetch any
                    // data from the HTML5 data-* attribute
                    if (!(key in data)) {
                        data[key] = dataAttr(node, "data-" + key);
                    }

                    return data[key];
                } else if (key && is(key, "object")) {
                    if (isArray(key)) {
                        return this.data(key.map((key) => key));
                    } else {
                        return forOwn(key, (key, value) => {
                            this.data(key, value);
                        });
                    }
                }
            } else if (len === 2) {
                this._[key] = value;
            }
            return this;
        }
}, null, () => RETURN_THIS);