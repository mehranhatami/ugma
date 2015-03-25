import { is, inArray } from "../helpers";

function parseAttr(_, name, value, rawValue) {
    // try to detemnie which kind of quotes to use
    var quote = value && inArray(value, "\"") >= 0 ? "'" : "\"";

    if (is(rawValue, "string")) {
        value = rawValue;
    } else if (!is(value, "string")) {
        value = name;
    }
    return " " + name + "=" + quote + value + quote;
}

export { parseAttr };