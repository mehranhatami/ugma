import { filter, map, keys, camelize, each, forOwn } from "../helpers";
import { VENDOR_PREFIXES, HTML } from "../const";

// Helper for CSS properties access

var cssHooks = { get: {}, set: {}, _default(name, style) {
        var propName = camelize(name);

        if (!(propName in style)) {
            propName = filter(map(VENDOR_PREFIXES, (prefix) => prefix + propName[0].toUpperCase() + propName.slice(1)), (prop) => prop in style)[0];
        }

        return this.get[name] = this.set[name] = propName;
    }},
    directions = ["Top", "Right", "Bottom", "Left"],
    shortCuts = {
        font: ["fontStyle", "fontSize", "/", "lineHeight", "fontFamily"],
        borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
        padding: map(directions, (dir) => "padding" + dir),
        margin: map(directions, (dir) => "margin" + dir),
        "border-width": map(directions, (dir) => "border" + dir + "Width"),
        "border-style": map(directions, (dir) => "border" + dir + "Style")
    };

    // Don't automatically add 'px' to these possibly-unitless properties
    each(("box-flex box-flex-group column-count flex flex-grow flex-shrink order orphans " +
        "color richness volume counter-increment float reflect stop-opacity " +
        "float fill-opacity font-weight line-height opacity orphans widows z-index zoom " +
        // SVG-related properties
        "stop-opacity stroke-mitrelimit stroke-opacity fill-opacity").split(" "), (propName) => {
    var stylePropName = camelize(propName);

    if (propName === "float") {
        stylePropName = "cssFloat" in HTML.style ? "cssFloat" : "styleFloat";
        // normalize float css property
        cssHooks.get[propName] = cssHooks.set[propName] = stylePropName;
    } else {
        cssHooks.get[propName] = stylePropName;
        cssHooks.set[propName] = (value, style) => {
            style[stylePropName] = value + "";
        };
    }
});

// normalize property shortcuts
forOwn(shortCuts, (key, props) => {

    cssHooks.get[key] = (style) => {
        var result = [],
            hasEmptyStyleValue = (prop, index) => {
                result.push(prop === "/" ? prop : style[prop]);

                return !result[index];
            };

        return props.some(hasEmptyStyleValue) ? "" : result.join(" ");
    };

    cssHooks.set[key] = (value, style) => {
        if (value && "cssText" in style) {
            // normalize setting complex property across browsers
            style.cssText += ";" + key + ":" + value;
        } else {
           each(props, (name) => style[name] = typeof value === "number" ? value + "px" : value + "");
        }
    };
});

export default cssHooks;
