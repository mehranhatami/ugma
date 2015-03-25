import { ugma } from "../core";
import { implement, each } from "../helpers";
import { DOCUMENT, WINDOW } from "../const";
import { minErr } from "../minErr";

var callbacks = [],
    readyState = DOCUMENT.readyState,
    pageLoaded = () => {
        // safely trigger stored callbacks
        if (callbacks) callbacks = callbacks.forEach(ugma.dispatch, ugma);
    };

// Catch cases where ready is called after the browser event has already occurred.
// IE10 and lower don't handle "interactive" properly... use a weak inference to detect it
// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
if (DOCUMENT.attachEvent ? readyState === "complete" : readyState !== "loading") {
    // use setTimeout to make sure that the dispatch method exists
    WINDOW.setTimeout(pageLoaded, 0);
} else {
    WINDOW.addEventListener("load", pageLoaded, false);
    DOCUMENT.addEventListener("DOMContentLoaded", pageLoaded, false);
}
implement({

    ready: function(callback) {
        if (typeof callback !== "function") minErr();

        if (callbacks) {
            callbacks.push(callback);
        } else {
            ugma.dispatch(callback);
        }
    }
});