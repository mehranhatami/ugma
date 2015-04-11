/**
 * @module const
 */

/* globals window, document */

import { Document } from "./core/core";

// globals
export const WINDOW = window;
export const DOCUMENT = document;
export const HTML = DOCUMENT.documentElement;

// constants
export const RETURN_THIS = function() { return this };
export const RETURN_TRUE = () => true;
export const RETURN_FALSE = () => false;
export const FOCUSABLE = /^(?:input|select|textarea|button)$/i;

// Internet Explorer
// WARNING! 'document.documentMode' can not be used to identify
// Internet Explorer. In some cases it only identify IE if the console
// window are open.

  var jscriptVersion = WINDOW.ScriptEngineMajorVersion;
  export const INTERNET_EXPLORER = jscriptVersion && jscriptVersion();

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
  export const VENDOR_PREFIXES = [ "Webkit", "Moz", "ms", "O" ];

 /** 
  * Check to see if we"re in IE9 to see if we are in combatibility mode and provide
  *  information on preventing it
  */
if (DOCUMENT.documentMode && INTERNET_EXPLORER < 10) {
    WINDOW.console.warn("Internet Explorer is running in compatibility mode, please add the following " +
        "tag to your HTML to prevent this from happening: " +
        "<meta http-equiv='X-UA-Compatible' content='IE=edge' />"
    );
}