# ugma

[![Build Status](https://secure.travis-ci.org/ugma/ugma.png?branch=master)](https://travis-ci.org/ugma/ugma)

[![Join the chat at https://gitter.im/ugma/ugma](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ugma/ugma?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Small, fast, and modular javascript framework for modern browsers that let you develop complex things in 5 minutes with native javascript. No need for heavy libraries such as jQuery, MooTools, Prototype etc.

There is no documentation, but examples are given in the comments inside the source files.

##How to use?

Familiar with DOM Living and native javascript?

```javascript

// Collect CSS selectors

ugma.query("#foo")

ugma.queryAll("#foo")

// Add a class...

ugma.query("#foo").addClass("hello!!")

// Add a class with native Array.prototype.foreach

ugma.query(".bar").forEach( function(node) {

   node.addClass("hello!!")
});


```
All **all** methods returns an native array and let you use libraries such as loadash and underscore.

Mote info about how ugma works, you find here: https://dom.spec.whatwg.org/

For templating, Emmet syntax are used.  

Reference: http://docs.emmet.io/cheat-sheet/


```javascript

// render HTML ( done in memory - not touching DOM )

var div_one = ugma.render("div") // 1 div tags

var div_two = ugma.renderAll("div*2") // 2 div tags [Array]

// Append to DOM (touch DOM only once)

ugma.append( div_two);

```
##DOM

ugma is DOM, and it's own document. Just after the DOM living specs. You can create multiple documents or shadows.

```javascript

// Access ugma as root

alert(ugma);

```

So you don't need to query for document to do your magic because ugma *is* the document itself.

Example on difference between jQuery:

```javascript

// jQuery

$(document).on('click', function() {  });

// ugma

ugma.on('click', function() {  });

```


##Shadow DOM

**ugma** supports Shadow DOM, but have it's own implementation of it. When you are using Shadow DOM or ugmas implementation - .shadow(), be aware that nothing that are hooked on the *ugma* namespace will be available in your shadow. This because it's a totaly different document you are working on.

```javascript

// Create a 'shadow', and attach a event handler on the shadow document.

ugma.query('body').shadow('foo', function(core) {
  // This 'click' event will only work inside the created 'shadow'
  // Click outside the shadow, and nothing happen.
   core.on('click', function() { alert("Hello!"); });
});

```
All .shadow() work the same way as ugma, but are a different document. Just the same as native shadow DOM. That means that you can use query[All] or other API methods on nodes outside the shadow. That will not work.

The root of the created shadow are the first argument.

```javascript

// 'core' are the new document. It's work the same way as 'ugma' document.

ugma.query('body').shadow('foo', function(core) { });

```

However, you can all other documents inside a *shadow*, and the API functions will *only* work for the document you are calling.

```javascript

// Create a 'shadow', and attach a event handler on the shadow document.

ugma.query('body').shadow('foo', function(core) {
  
  // Attach a click handler on the 'ugma' document
   ugma.on('click', function() { alert("Hello!"); });
});

```
In this example - if you click on the shadow - nothing will happen. If you click on the *ugma* document, you will see an alert with *Hello!*

Note there is a small difference between .shadow() and the shadow DOM. The biggest difference is that you can have multiple shadows on each DOM node - just give them a unique name.

```javascript

// Create 3 shadows on the document body.

ugma.query('body').shadow('foo', function(core) { });

ugma.query('body').shadow('bar', function(core) { });

ugma.query('body').shadow('zoo', function(core) { });

```

#Installation

Download the repo and run:

```javascript
npm install
```

This will install all dependencies for you, so you can modify the source code as you wish.

Ugma are using **gulp** and ES6 transpillers, but the commands are stright forward:

```javascript

// compile the code

$ gulp compile

// minimize - compress

$ gulp minify

// running tests

$ gulp test

// linting

$ gulp lint

```

The plugins are part of the build process and will be build together with ugma.

```javascript
// build the XHR plugin
$ gulp xhr

// minimize the XHR plugin

$ gulp minifyXHR

```

#Plugin contribution

For contribution of ugma plugins to this repo, it's important to remember:

1. Need to be added in the plugin folder with a readme.md file.
2. All plugins should be written in ES6.
3. Create a sub-folder in the test folder for the plugin, and run minimum 5 test cases 
4. Make a own build and minified build for the plugin in the gulp.js file, and merge it with the existing build process.
