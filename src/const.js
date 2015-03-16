/* globals window, document */

import { Document } from "./types";

// globals
export const WINDOW = window;
export const DOCUMENT = document;
export const HTML = DOCUMENT.documentElement;
export const RCSSNUM = /^(?:([+-])=|)([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))([a-z%]*)$/i;

// error messages
export const ERROR_MSG = {
    1: "The string did not match the expected pattern",
    2: "The string contains invalid characters.",
    3: "Wrong amount of arguments.",
    4: "This operation is not supported",
    6: "The property or attribute is not valid.",
    7: "The first argument need to be a string"
};

// identity
export const identityFunction = (arg) => () => arg;
export const RETURN_THIS = function() {return this};
export const RETURN_TRUE = identityFunction(true);
export const RETURN_FALSE = identityFunction(false);

// Browser
export const INTERNET_EXPLORER = document.documentMode;
export const GINGERBREAD = /Android 2\.3\.[3-7]/i.test(WINDOW.navigator.userAgent);

// Prefixes
export const VENDOR_PREFIXES = ["Webkit", "Moz", "ms", "O"];
export const WEBKIT_PREFIX = WINDOW.WebKitAnimationEvent ? "-webkit-" : "";

// Set a new document, and define a local copy of ugma
var ugma = new Document(DOCUMENT);

export { ugma };