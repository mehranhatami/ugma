import { is } from "../helpers";

export function parseAttr(_, name, value, rawValue) {
    // try to detemnie which kind of quotes to use
    var quote = value && value.indexOf("\"") >= 0 ? "'" : "\"";

    if (is(rawValue, "string")) {
        value = rawValue;
    } else if (!is(value, "string")) {
        value = name;
    }
    return " " + name + "=" + quote + value + quote;
}