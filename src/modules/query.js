/**
 * @module query
 */

import { DOCUMENT, ugma, ERROR_MSG, HTML   } from "../const";
import { Nodes, Shallow, implement         } from "../core/core";
import { minErr                            } from "../minErr";
import { is, map, proxy                    } from "../helpers";

var unionSplit = /([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,
    fasting = /^(?:(\w+)|\.([\w\-]+))$/,
    rescape = /'|\\/g;

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

    if ( !is( selector, "string" ) ) minErr( methodName + "()", "Syntax error" );

    var node = this[0],
        quickMatch = fasting.exec( selector ),
        result, old, nid, context,
        useRoot = ( context, query, method ) => {
            // this function creates a temporary id so we can do rooted qSA queries, this is taken from sizzle
            var oldContext = context,
                old = context.getAttribute( "id" ),
                nid = old || "__ugma__",
                hasParent = context.parentNode,
                relativeHierarchySelector = /^\s*[+~]/.test( query );

            if ( relativeHierarchySelector && !hasParent ) return [];

            if ( !old ) {
                context.setAttribute( "id", nid );
            } else {
                nid = nid.replace( /'/g, "\\$&" );
            }

            if (relativeHierarchySelector && hasParent) context = context.parentNode;

            var selectors = query.match( unionSplit ),
                index = -1,
                length = selectors.length;

                while ( ++index < length ) selectors[ index ] = "[id='" + nid + "'] " + selectors[ index ];
                query = selectors.join(",");

            try {
                return method.call( context, query );
            } finally {
                if ( !old ) {
                    oldContext.removeAttribute( "id" );
                }
            }
        };

    if ( quickMatch ) {
        if ( quickMatch [1] ) {
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

        if ( node !== node.ownerDocument.documentElement ) {

            result = useRoot( node, selector, node[ "querySelector" + all ] );

        } else {

            result = proxy( context, "querySelector" + all, selector );
        }

        if (!old) node.removeAttribute( "id" );
    }

    return all ? map( result, Nodes ) : Nodes( result );

}, ( methodName, all ) => () => all ? [] : new Shallow() );