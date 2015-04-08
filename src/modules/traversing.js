/**
 * @module traversing
 */

/** 
 * Loosely based on this:
 * http://www.w3.org/TR/ElementTraversal/
 */

import { Nodes, Shallow, implement       } from "../core/core";
import SelectorMatcher                     from "../util/selectormatcher";
import { is, map                         } from "../helpers";
import { minErr                          } from "../minErr";

implement({

    /**
     * Find first element to the supplied element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *    link.first();
     */
    first: "firstElementChild",
    /**
     * Find last element to the supplied element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *
     *      <div id="australopithecus">
     *        <div id="homo-erectus"><!-- Latin is super -->
     *          <div id="homo-neanderthalensis"></div>
     *          <div id="homo-sapiens"></div>
     *        </div>
     *      </div>
     *
     *      ugma.query('#australopithecus').first().get("id")
     *      // -> div#homo-erectus
     *
     *      ugma.query('#homo-erectus')[0].firstChild
     *      // -> comment node "Latin is super"
     *
     *      ugma.query('#homo-erectus').first()
     *      // -> div#homo-neanderthalensis
     *
     */
    last: "lastElementChild",
    /**
     * Find next sibling element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *    link.next();             
     *    link.next("i"); 
     */
    next: "nextElementSibling",
    /**
     * Find previous sibling element filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *
     *      <ul id="fruits">
     *        <li id="apples">
     *          <h3 id="title">Apples</h3>
     *          <ul id="list-of-apples">
     *            <li id="golden-delicious">Golden Delicious</li>
     *            <li id="mutsu">Mutsu</li>
     *            <li id="mcintosh" class="yummy">McIntosh</li>
     *            <li id="ida-red" class="yummy">Ida Red</li>
     *          </ul>
     *          <p id="saying">An apple a day keeps the doctor away.</p>  
     *        </li>
     *      </ul>
     *
     *  Get the first sibling after "#title":
     *  
     *      ugma.query('title').next();
     *      // -> ul#list-of-apples
     *
     *  Get the first sibling after "#title" with node name "p":
     *
     *      ugma.query('title').next('p');
     *      // -> p#sayings
     *
     *  Get the first sibling after "#golden-delicious" with class name "yummy":
     *      
     *      ugma.query('golden-delicious').next('.yummy');
     *      // -> li#mcintosh
     *
     *  Try to get the first sibling after "#ida-red":
     *
     *      ugma.query('ida-red').next();
     *      // -> undefined   
     */   
      prev: "previousElementSibling",
    /**
     * Find all next sibling elements filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *
     *      <ul id="fruits">
     *        <li id="apples">
     *          <h3>Apples</h3>
     *          <ul id="list-of-apples">
     *            <li id="golden-delicious" class="yummy">Golden Delicious</li>
     *            <li id="mutsu" class="yummy">Mutsu</li>
     *            <li id="mcintosh">McIntosh</li>
     *            <li id="ida-red">Ida Red</li>
     *          </ul>
     *          <p id="saying">An apple a day keeps the doctor away.</p>  
     *        </li>
     *      </ul>
     * Get the first previous sibling of "#saying":
     *  
     *      $('saying').prev();
     *      // -> ul#list-of-apples
     *
     *  Get the first previous sibling of "#ida-red" with class name "yummy":
     *
     *      ugma.query('#ida-red').prev('.yummy').get("id");
     *      // -> li#mutsu
     */
    nextAll: "nextElementSibling",
    /**
     * Find all previous sibling elements filtered by optional selector
     * @param {String} [selector] css selector
     * @chainable
     * @example
     *     link.nextAll();
     *     link.nextAll("i");
     */
    prevAll: "previousElementSibling"
    
}, (methodName, propertyName) => function( selector ) {

    if ( selector && !is( selector, "string" ) ) minErr( methodName + "()", "The provided argument did not match the expected pattern" );

    var currentNode = this[ 0 ],
        matcher = SelectorMatcher( selector ),
        all = methodName.slice( -3 ) === "All",
        descendants = all ? [] : null;

    if ( !matcher ) currentNode = currentNode[ propertyName ];

    for (; currentNode; currentNode = currentNode[ propertyName ] ) {
        if ( currentNode.nodeType === 1 && ( !matcher || matcher( currentNode ) ) ) {
            if ( !all ) break;

            descendants.push( currentNode );
        }
    }

    return all ? map( descendants, Nodes ) : Nodes( currentNode );
}, ( methodName ) => () => methodName.slice( -3 ) === "All" ? [] : new Shallow() );