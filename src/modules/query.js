/**
 * @module query
 */

import { Nodes, Shallow, implement     } from "../core/core";
import { minErr                        } from "../minErr";
import { map, proxy                    } from "../helpers";

var fasting  = /^(?:(\w+)|\.([\w\-]+))$/,
    rescape  = /'|\\/g;

implement({
 /**
  * Find the first matched element by css selector
  * @param  {String} selector css selector
  * @example
  *
  *      ugma.query('#foo'); 
  *      // first, single element
  */
    query: "",
 /**
  * Find all matched elements by css selector
  * @param  {String} selector css selector
  * @example
  *
  *      ugma.queryAll('#div'); 
  *      // return an array with multiple divs
  *
  *      ugma.query('a[href="#"]');
  *      // -> all links with a href attribute of value "#"
  *
  *      ugma.query('div:empty');
  *      // -> all DIVs without content (i.e., whitespace-only)
  */
   queryAll: "All"

}, (methodName, all) => function(selector) {
    if (typeof selector !== "string") minErr();

    var node = this[ 0 ],
        quickMatch = fasting.exec(selector),
        result, old, nid, context;

    if (quickMatch) {
        if (quickMatch[ 1 ]) {
            // speed-up: "TAG"
            result = node.getElementsByTagName( selector );
        } else {
            // speed-up: ".CLASS"
            result = node.getElementsByClassName( quickMatch[ 2 ] );
        }

        if ( result && !all ) result = result[ 0 ];
        
    } else {
        old = true;
        context = node;

        if (node !== node.ownerDocument.documentElement) {
            // qSA works strangely on Element-rooted queries
            // We can work around this by specifying an extra ID on the root
            // and working up from there (Thanks to Andrew Dupont for the technique)
            if ( (old = node.getAttribute( "id" )) ) {
                nid = old.replace( rescape, "\\$&" );
            } else {
                nid = "<%= prop('ugma') %>";
                node.setAttribute("id", nid);
            }

            nid = "[id='" + nid + "'] ";
            
            selector = nid + selector.split(",").join("," + nid);
        }

        result = proxy(context, "querySelector" + all, selector);

        if (!old) node.removeAttribute("id");
    }

        return all ? map(result, Nodes) : Nodes(result);
        
}, (methodName, all) => () => all ? [] : new Shallow());