import { WINDOW, DOCUMENT, INTERNET_EXPLORER } from "./const";

  // Support: IE< 10
  if (INTERNET_EXPLORER < 10) {

      // Throw if IE8
      if (INTERNET_EXPLORER < 9) {
          throw Error("Ugma Framework does not support IE8 and older IE versions");
      }

      if (DOCUMENT.documentMode) {
          //  If we"re in IE9, check to see if we are in combatibility mode and provide
          // information on preventing it
          WINDOW.console.warn("Internet Explorer is running in compatibility mode, please add the following " +
              "tag to your HTML to prevent this from happening: " +
              "<meta http-equiv='X-UA-Compatible' content='IE=edge' />"
          );
      }
  }

  function Node() {}

  // Ugma are presented as a node tree similar to DOM Living specs,
  // and it is represented as follows:
  //  
  //
  // |_ Document   (ugma)
  // |
  // |_ Node ( dummy functions)
  // |
  // |_ Element
  //     |- nodes  
  //
  // All functions and methods are attched to current document, and not
  // available in other documents / another document tree.
  //
  // As a paralell to this the Shadow() method create shadow DOM elements on a new
  // document, and create it's own document tree, and methods. 
  // http://www.w3.org/TR/shadow-dom/

  function Element(node) {
      if (this instanceof Element) {
          if (node) {
              node["<%= prop() %>"] = this;

              this[0] = node;
              this._ = {};
          }
      } else if (node) {
          // create a wrapper only once for each native element
          return node["<%= prop() %>"] || new Element(node);
      } else {
          return new Node();
      }
  }

  // Set correct document, and determine what kind it is.
  function Document(node) {
      return Element.call(this, node.documentElement);
  }

  Element.prototype = {
      // all of these placeholder strings will be replaced by gulps's
      version: "<%= pkg.version %>",
      codename: "<%= pkg.codename %>",

      toString() {
          var node = this[0];
          return node && node.tagName ? "<" + node.tagName.toLowerCase() + ">" : "";
      },
  };

  Node.prototype = new Element();
  Node.prototype.toString = () => "";

  Document.prototype = new Element();
  // we are only interested in elements (1) because they are the root 
  // element, and will be referred to as the '<document>'.
  //
  // Example:  
  //
  // console.log(umga) 
  // 
  // will output: '<document>'

  Document.prototype.toString = () => "<document>";

  export { Element, Node, Document };