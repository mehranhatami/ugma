/**
 * @module processTag
 */

import tagCache from "../template/template";
// return tag's from tagCache with <code>tag</code> type
function processTag(tag) {
    return tagCache[tag] || (tagCache[tag] = "<" + tag + "></" + tag + ">");
}

export { processTag };