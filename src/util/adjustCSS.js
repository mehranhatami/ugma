import { DOCUMENT, WINDOW, RCSSNUM } from "../const";
import { Document, Element, Node } from "../core";

export function adjustCSS(root, prop, parts, computed) {

    var adjusted,
        scale = 1,
        maxIterations = 20,
        currentValue = function() {
            return parseFloat(computed[prop]);
        },
        initial = currentValue(),
        unit = parts && parts[3] || "",
        // Starting value computation is required for potential unit mismatches
        initialInUnit = (unit !== "px" && +initial) && RCSSNUM.exec(computed[prop]);

    if (initialInUnit && initialInUnit[3] !== unit) {

        unit = unit || initialInUnit[3];

        parts = parts || [];

        // Iteratively approximate from a nonzero starting point
        initialInUnit = +initial || 1;

        do {
            // If previous iteration zeroed out, double until we get *something*.
            // Use string for doubling so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            initialInUnit = initialInUnit / scale;
            root.css(prop, initialInUnit + unit);

            // Break the loop if scale is unchanged or perfect, or if we've just had enough.
        } while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
    }

    if (parts) {
        // Apply relative offset (+=/-=) if specified
        adjusted = parts[1] ? (+initialInUnit || +initial || 0) + (parts[1] + 1) * parts[2] : +parts[2];

        return adjusted;
    }
};