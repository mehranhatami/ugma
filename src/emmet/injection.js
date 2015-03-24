    export function injection(term, adjusted) {
        return function(html) {
            // find index of where to inject the term
            var index = adjusted ? html.lastIndexOf("<") : html.indexOf(">");
            // inject the term into the HTML string
            return html.slice(0, index) + term + html.slice(index);
        };
    }