import { implement, filter } from "../helpers";
import { RETURN_THIS } from "../const";

implement({
    // Subscribe on particular properties / attributes, and get notified if they are changing
    subscribe(name, callback) {
            var subscription = this._["<%= prop('subscription') %>"] || (this._["<%= prop('subscription') %>"] = []);

            if (!subscription[name]) subscription[name] = [];

            subscription[name].push(callback);

            return this;
        },

        // Cancel / stop a property / attribute subscription
        unsubscribe(name, callback) {
            var subscription = this._["<%= prop('subscription') %>"];

            if (subscription[name]) {
                subscription[name] = filter(subscription[name], (cb) => cb !== callback);
            }
            return this;
        }
}, null, () => RETURN_THIS);