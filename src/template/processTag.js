import tagCache from "../template/emmet";
// return tag's from tagCache with <code>tag</code> type
function processTag(tag) {
    return tagCache[tag] || (tagCache[tag] = "<" + tag + "></" + tag + ">");
}

export { processTag };