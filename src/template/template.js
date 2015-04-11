/**
 * @module template
 */

import { ugma, implement            } from "../core/core";
import { is, each, forOwn, isArray  } from "../helpers";
import { minErr                     } from "../minErr";
import { process                    } from "../template/process";
import   operators                    from "../template/operators";

/* es6-transpiler has-iterators:false, has-generators: false */

// Reference: https://github.com/emmetio/emmet

var dot = /\./g,
    abbreviation = /`[^`]*`|\[[^\]]*\]|\.[^()>^+*`[#]+|[^()>^+*`[#.]+|\^+|./g,
    templateHooks = {},
    tagCache = { "": "" };

// Expose 'templateHooks' to the global scope

/**
 * Make 'eventHooks' global
 * Has to use the "implement" API method here, so this will be accessible
 * inside the 'shadow DOM' implementation.
 */
 
 implement({
     
  templateHooks:(  obj ) => {
     if ( is( obj, "object" ) && !isArray( obj ) ) {

        forOwn( obj, ( key, value ) => {
            if ( is( value, "string" ) ) {
                templateHooks[ key ] = value;
            }
        });
    }
  }
  
 });

ugma.template = function( template, args ) {

    if ( !is(template, "string" ) ) minErr( "template()", "The first argument need to be a string" );

    if ( args ) template = ugma.format( template, args );

    // use template hooks if they exist
    var hook = templateHooks[ template ];
    
    template = hook && is( hook, "string" ) ? hook : template;

    if ( template in tagCache ) return tagCache[ template ];

    var stack = [],
        output = [];

    each(template.match( abbreviation ), ( str ) => {

        if ( operators[ str[ 0 ] ] ) {
            if ( str !== "(" ) {
                // for ^ operator need to skip > str.length times
                for ( let i = 0, n = (str[ 0 ] === "^" ? str.length : 1 ); i < n; ++i ) {
                    while ( stack[ 0 ] !== str[ 0 ] && operators[ stack[ 0 ] ] >= operators[ str[ 0 ] ] ) {
                        let head = stack.shift();
                        output.push( head );
                        // for ^ operator stop shifting when the first > is found
                        if ( str[ 0 ] === "^" && head === ">" ) break;
                    }
                }
            }

            if ( str === ")" ) {
                stack.shift(); // remove "(" symbol from stack
            } else {
                // handle values inside of `...` and [...] sections
                if ( str[ 0 ] === "[" || str[ 0 ] === "`" ) output.push( str.slice( 1, -1 ) );

                // handle multiple classes, e.g. a.one.two
                if ( str[ 0 ] === "." ) output.push( str.slice( 1 ).replace( dot, " ") );

                stack.unshift( str[ 0 ] );
            }
        } else {
            output.push( str );
        }
    });

    output = output.concat( stack );

    return process( output );
};

// populate empty tag names with result
each( "area base br col hr img input link meta param command keygen source".split(" "), ( tag ) => { tagCache[ tag ] = "<" + tag + ">" } );

export default tagCache;