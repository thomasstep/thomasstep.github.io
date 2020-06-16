---
layout: post
title:  "Splitting Javascript Classes Into Different Files"
author: thomas
categories: [ dev, javascript ]
image: https://thomasstep.s3.amazonaws.com/skontorp1.jpg
featured: true
hidden: false
comments: true
---
I come from a C++ background, so I turn to header files to help me organize files and reduce file size.
I'm new to object oriented programming in Javascript, and I have been searching for best practices on the equivalent of header files for classes or splitting classes up into multiple files.
I could not find a definitive answer (and didn't know the best keywords to search on) but I did come up with something on my own.
Since classes in Javascript are just special functions and functions are just `Function` objects, I toyed around with declaring the class itself and being able to add in functions later in the same way you can create an object and add key-value pairs in later.
After learning a little bit more about [what happens with classes under the hood](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), I realized that adding functions to the class's prototype had the same effect as adding the functions inside the class's body.

I went from something like this:
```javascript
// animal.js
class Animal {
  noise() {
    return 'moo';
  }
}
```

to something like this:
```javascript
// moo.js
function noise() {
  return 'moo';
}

module.exports = {
  noise,
};

//animal.js
const { noise } = require('./moo');
class Animal {}

Animal.prototype.noise = noise;
```

The main motivation behind looking into this was classes that could potentially get large and wanting to split those files up into smaller more digestable files.
With this approach the class functions can be put into as many different files as need be and collected in the file where the class is declared.
Is there a better or more standard way of doing this?
