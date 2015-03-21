import tagCache from "../emmet/emmet";
// Process element with <code>tag</code> type
export function processTag(tag) {
    return tagCache[tag] || (tagCache[tag] = "<" + tag + "></" + tag + ">");
}