import { implement, forOwn, map, is, isArray } from "../helpers";
import { RETURN_THIS } from "../const";
import { dataAttr } from "../util/dataAttr";

implement({
    // Getter/setter of a data entry value. Tries to read the appropriate
    // HTML5 data-* attribute if it exists
    data(key, value) {
        var len = arguments.length;
        if (len === 1) {
            if (is(key, "string")) {

                var data = this._;
                // If no data was found internally, try to fetch any
                // data from the HTML5 data-* attribute
                if (!(key in data)) data[key] = dataAttr(this[0], "data-" + key);

                return data[key];
                // Sets multiple values
            } else if (key && is(key, "object")) {
                if (isArray(key)) {
                    return this.data(map(key, (key) => key));
                } else {
                    return forOwn(key, (key, value) => {
                        this.data(key, value);
                    });
                }
            }
        } else if (len === 2) {
            // delete the private property if the value is 'null' or 'undefined'
            if (value === null || 
                value === undefined) {
                delete this._[key];
            } else {
                this._[key] = value;
            }
        }
        return this;
    }
}, null, () => RETURN_THIS);