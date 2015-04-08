/**
 * @module manipulation
 */

import { RETURN_THIS                           } from "../const";
import { ugma, Nodes, implement, instanceOf    } from "../core/core";
import { minErr                                } from "../minErr";
import { isArray, trim, each, is, sliceArgs    } from "../helpers";

// https://dom.spec.whatwg.org
// 
// Section: 4.2.5 Interface ChildNode

implement({
    
   /**
    *  Append HTMLString, native DOM element or a ugma wrapped object to the current element
    *
    * @param {Mixed} content HTMLString, Nodes, native DOM element or functor that returns content
    * @return {Object} The wrapped collection
    * @chainable
    * @example
    *     link.append('<p>more</p>');
    *     link.append(ugma.render("b"));
    */
    append: [ "beforeend", true, false, ( node, relatedNode ) => {
        node.appendChild( relatedNode );
    }],
   /**
    * Prepend  HTMLString, native DOM element or a ugma wrapped object to the current element
    *
    * @param {Mixed} content HTMLString, Nodes, native DOM element or functor that returns content
    * @return {Object} The wrapped collection
    * @chainable
    * @example
    *     link.prepend('<span>start</span>');
    */    
    prepend: [ "afterbegin", true, false, ( node, relatedNode ) => {
        node.insertBefore( relatedNode, node.firstChild );
    }],
   /**
    * Insert  HTMLString, native DOM element or a ugma wrapped object before the current element
    *
    * @param {Mixed} content HTMLString, Nodes, native DOM element or functor that returns content
    * @return {Object} The wrapped collection
    * @chainable
    * @example
    *     link.before('<p>prefix</p>');
    *     link.before(ugma.render("i"), ugma.render("u"));
    */    
    before: [ "beforebegin", true, true, ( node, relatedNode ) => {
        node.parentNode.insertBefore( relatedNode, node );
    }],
   /**
    * Insert HTMLString, native DOM element or a ugma wrapped object after the current element
    *
    * @param {Mixed} content HTMLString, Nodes, native DOM element or functor that returns content
    * @return {Object} The wrapped collection
    * @chainable
    * @example
    *     link.after('<span>suf</span><span>fix</span>');
    *     link.after(ugma.render("b"));   
    */    
    after: [ "afterend", true, true, ( node, relatedNode ) => {
        node.parentNode.insertBefore( relatedNode, node.nextSibling );
    }],
   /**
    * Replace current element with HTMLString or a ugma wrapped object
    *
    * @param {Mixed} content HTMLString, Nodes, native DOM element or functor that returns content
    * @return {Object} The wrapped collection
    * @chainable
    * @example
    *
    *     var div = ugma.render("div>span>`foo`");   
    *         div.child(0).replace(ugma.render("b>`bar`"));
    */    
    replaceWith: [ "", false, true, ( node, relatedNode ) => {
        node.parentNode.replaceChild( relatedNode, node );
    }],
   /**
    * Remove current element from the DOM
    *
    * @param {Mixed} content HTMLString, Nodes, native DOM element or functor that returns content
    * @return {Object} The wrapped collection
    * @chainable
    * @example
    *     link.remove();
    *
    *     var foo = ugma.query(".bar");
    *     bar.remove();    
    */    
    remove: [ "", false, true, ( node ) => {
        node.parentNode.removeChild( node );
    }]
}, (methodName, adjacentHTML, native, requiresParent, strategy) => function() {
    
      var contents = sliceArgs( arguments ),
          node = this[ 0 ];

    if ( requiresParent && !node.parentNode ) return this;

    if ( ( methodName === "after" || methodName === "before" ) && this === ugma ) {
         minErr( methodName + "()", "You can not " + methodName + " an element non-existing HTML (documentElement)" );
    }
    
    // don't create fragment for adjacentHTML
    var fragment = adjacentHTML ? "" : node.ownerDocument.createDocumentFragment();

    contents.forEach( ( content ) => {

        // Handle native DOM elements 
        // e.g. link.append(document.createElement('li'));
        if ( native && content.nodeType === 1 ) content = Nodes( content );

        if ( is( content, "function" ) ) content = content( this );

        // merge a 'pure' array into a string
        if ( isArray( content ) && !is( content[ 0 ], "object" ) ) content = content.join();

        if ( is( content, "string" ) ) {
            if (is( fragment, "string" ) ) {
                fragment += trim( content );
            } else {
                content = ugma.renderAll( content );
            }
        } else if ( instanceOf(content) ) {
            content = [ content ];
        }
        
        // should handle documentFragment
        if ( content.nodeType === 11 ) {
            fragment = content;
        } else {
            if ( isArray( content ) ) {
                if ( is( fragment, "string" ) ) {
                    // append existing string to fragment
                    content = ugma.renderAll( fragment ).concat( content );
                    // fallback to document fragment strategy
                    fragment = node.ownerDocument.createDocumentFragment();
                }

                each( content, function( el ) {
                    fragment.appendChild( instanceOf(el) ? el[ 0 ] : el );
                });
            }
        }
    });

    if ( is( fragment, "string" ) ) {
        node.insertAdjacentHTML( adjacentHTML, fragment );
    } else {
        strategy( node, fragment );
    }

    return this;
    
}, () => RETURN_THIS );