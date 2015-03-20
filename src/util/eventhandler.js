import { slice, map, is } from "../helpers";
import { WINDOW } from "../const";
import { Element } from "../core";
import SelectorMatcher from "./selectormatcher";
import HOOK from "./eventhooks";

function getEventProperty(name, e, type, node, target, currentTarget) {
    if (is(name, "number")) {
        var args = e["<%= prop() %>"];

        return args ? args[name] : void 0;
    }

    switch (name) {
        case "type":
            return type;
        case "defaultPrevented":
            // Android 2.3 use returnValue instead of defaultPrevented
            return "defaultPrevented" in e ? e.defaultPrevented : e.returnValue === false;
        case "target":
            return Element(target);
        case "currentTarget":
            return Element(currentTarget);
        case "relatedTarget":
            return Element(e.relatedTarget);
    }

    var value = e[name];

    if (typeof value === "function") {
        return () => value.apply(e, arguments);
    }

    return value;
}

function EventHandler(type, selector, callback, props, el, once) {
    var node = el[0],
        hook = HOOK[type],
        matcher = SelectorMatcher(selector, node),
        handler = (e) => {
            e = e || WINDOW.event;
            // early stop in case of default action
            if (EventHandler.skip === type) return;
            var eventTarget = e.target || node.ownerDocument.documentElement;
            // Safari 6.0+ may fire events on text nodes (Node.TEXT_NODE is 3).
            // @see http://www.quirksmode.org/js/events_properties.html
            eventTarget = eventTarget.nodeType === 3 ? eventTarget.parentNode : eventTarget;
            // Test whether delegated events match the provided `selector` (filter),
            // if this is a event delegation, else use current DOM node as the `currentTarget`.
            var currentTarget = matcher &&
                // Don't process clicks on disabled elements
                (eventTarget.disabled !== true || e.type !== "click") ? matcher(eventTarget) : node,
                args = props || [];

            // early stop for late binding or when target doesn't match selector
            if (!currentTarget) return;

            // off callback even if it throws an exception later
            if (once) el.off(type, callback);

            if (props) {
                args = map(args, (name) => getEventProperty(
                    name, e, type, node, eventTarget, currentTarget));
            } else {
                args = slice.call(e["<%= prop() %>"] || [0], 1);
            }

            // prevent default if handler returns false
            if (callback.apply(el, args) === false) {
                e.preventDefault();
            }
        };

    if (hook) handler = hook(handler, el) || handler;

    handler.type = type;
    handler.callback = callback;
    handler.selector = selector;

    return handler;
}

export default EventHandler;