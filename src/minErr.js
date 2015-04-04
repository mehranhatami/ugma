/**
 * @module minErr
 */

/*
 * Export interface
 */

export function minErr(module, msg) {
    // NOTE! The 'es6transpiller' will convert 'this' to '$this0' if we try to
    // use the arrow method here. And the function will fail BIG TIME !!
    var wrapper = function() {
        this.message = module ? ( msg ? msg : "This operation is not supported" ) +
            ( module.length > 4 ? " -> Module: " + module : " -> Core " ) : "The string did not match the expected pattern";
        // use the name on the framework
        this.name = "ugma";
    };
    wrapper.prototype = Object.create( Error.prototype );
    throw new wrapper( module, msg );
}