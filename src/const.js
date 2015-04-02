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
export const INTERNET_EXPLORER = document.documentMode;

// Vendor prefixes
export const VENDOR_PREFIXES = [ "Webkit", "Moz", "ms", "O" ];

// css
export const RCSSNUM = /^(?:([+-])=|)([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))([a-z%]*)$/i;

//  Check to see if we"re in IE9 to see if we are in combatibility mode and provide
// information on preventing it
if (DOCUMENT.documentMode && INTERNET_EXPLORER < 10) {
    WINDOW.console.warn("Internet Explorer is running in compatibility mode, please add the following " +
        "tag to your HTML to prevent this from happening: " +
        "<meta http-equiv='X-UA-Compatible' content='IE=edge' />"
    );
}