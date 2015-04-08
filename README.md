# ugma

[![Build Status](https://secure.travis-ci.org/ugma/ugma.png?branch=master)](https://travis-ci.org/ugma/ugma)

[![Join the chat at https://gitter.im/ugma/ugma](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ugma/ugma?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Small, fast, and modular javascript framework for modern browsers that let you develop complex things in 5 minutes with native javascript. No need for heavy libraries such as jQuery, MooTools, Prototype etc.

There is no documentation, but examples are given in the comments inside the source files.

##How to use?

Familiar with DOM Living and native javasript?

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




