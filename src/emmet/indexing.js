var reIndex = /(\$+)(?:@(-)?(\d+)?)?/g,
    reDollar = /\$/g;

function indexing(num, term) {
    var stricted = num >= 1500 ? /* max 1500 HTML elements */ 1500 : (num <= 0 ? 1 : num),
        result = new Array(stricted),
        i = 0;

    for (; i < stricted; ++i) {
        result[i] = term.replace(reIndex, (expr, fmt, sign, base) => {
            var index = (sign ? stricted - i - 1 : i) + (base ? +base : 1);
            // handle zero-padded index values, like $$$ etc.
            return (fmt + index).slice(-fmt.length).replace(reDollar, "0");
        });
    }
    return result;
}
    export { indexing };