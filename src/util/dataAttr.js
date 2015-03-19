var multiDash = /([A-Z])/g;

 export function dataAttr(node, key) {
        // convert from camel case to dash-separated value
        key = "data-" + key.replace(multiDash, "-$1").toLowerCase();

        var value = node.getAttribute(key),
            parseJSON = (value) => {
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
    }