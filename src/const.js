/* globals window, document */

import { Document } from "./core";

// globals
export const WINDOW = window;
export const DOCUMENT = document;
export const HTML = DOCUMENT.documentElement;

// error messages
export const ERROR_MSG = {
    1: "The string did not match the expected pattern",
    2: "The string contains invalid characters.",
    3: "Wrong amount of arguments.",
    4: "This operation is not supported",
    6: "The property or attribute is not valid.",
    7: "The first argument need to be a string"
};

// constants
export const RETURN_THIS = function() {return this};
export const RETURN_TRUE = () => true;
export const RETURN_FALSE = () => false;

// Browser

const userAgent = WINDOW.navigator.userAgent;

export const INTERNET_EXPLORER = document.documentMode;
export const GINGERBREAD = /Android 2\.3\.[3-7]/i.test(userAgent);
export const ANDROID = /Android/i.test(userAgent);
export const CHROME = window.chrome;

// Prefixes
export const VENDOR_PREFIXES = ["Webkit", "Moz", "ms", "O"];
export const WEBKIT_PREFIX = WINDOW.WebKitAnimationEvent ? "-webkit-" : "";

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

// Set a new document, and define a local copy of ugma
var ugma = new Document(DOCUMENT);
export { ugma };