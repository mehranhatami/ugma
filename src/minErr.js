import { ERROR_MSG } from "./const";

export function minErr(module, msg) {
    var wrapper = () => {
        this.message = module ? (msg ? msg : ERROR_MSG[4]) +
            (module.length > 4 ? " -> Module: " + module : " -> Core ") : ERROR_MSG[1];
        // use the name on the framework
        this.name = "ugma";
    };
    wrapper.prototype = Object.create(Error.prototype);
    throw new wrapper(module, msg);
}