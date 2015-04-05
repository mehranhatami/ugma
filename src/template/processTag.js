/**
 * @module processTag
 */

import tagCache from "../template/template";
// return tag's from tagCache with tag type
function processTag( tag ) {
    return tagCache[ tag ] || ( tagCache[ tag ] = "<" + tag + "></" + tag + ">" );
}

/*
 * Export interface
 */

export { processTag };