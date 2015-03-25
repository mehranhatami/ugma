import { DOCUMENT, RETURN_TRUE, ERROR_MSG } from "../const";
import { implement, is } from "../helpers";
import { minErr } from "../minErr";

var dispatcher = DOCUMENT.createElement("a"),
    safePropName = "onpropertychange";
    // for modern browsers use late binding for safe calls
    // dispatcher MUST have handleEvent property before registering
    dispatcher[safePropName = "handleEvent"] = null;
    dispatcher.addEventListener(safePropName, dispatcher, false);


implement({
    // Make a safe method/function call
    dispatch(method, ...args) {
   var  node = this[0],
        handler, result, e;

    if (node) {
        if (is(method, "function")) {
            handler = () => { result = method.apply(this, args) };
        } else if (is(method, "string")) {
            handler = () => { result = node[method].apply(node, args) };
        } else {
            minErr("dispatch()", ERROR_MSG[1]);
        }
        // register safe invokation handler
        dispatcher[safePropName] = handler;
        // make a safe call
            e = DOCUMENT.createEvent("HTMLEvents");
            e.initEvent(safePropName, false, false);
            dispatcher.dispatchEvent(e);
        // cleanup references
        dispatcher[safePropName] = null;
    }

   return result;
}
}, null, () => RETURN_TRUE);
