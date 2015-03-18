import { VENDOR_PREFIXES, HTML } from "../const";
import { map } from "../helpers";
// used both for matchesSelector and as a fallback if QSA fails
export const vendorPrefixed = map(VENDOR_PREFIXES.concat(null), function(p) {
        return (p ? p.toLowerCase() + "M" : "m") + "atchesSelector";
    }).reduceRight(function(propName, p) {
        return propName || (HTML.matches && "matches" || p in HTML && p);
    }, null);