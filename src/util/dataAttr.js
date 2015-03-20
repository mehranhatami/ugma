var multiDash = /([A-Z])/g;

export function dataAttr(node, key) {

    // convert from camel case to dash-separated value

    key = "data-" + key.replace(multiDash, "-$&").toLowerCase();

    var value = node.getAttribute(key);

    if (value != null) {

        // try to recognize and parse object notation syntax
        if (value[0] === "{" && value[value.length - 1] === "}") {
            try {
                value = JSON.parse(value);
            } catch (err) {}
        }
    }

    return value;
}