---
layout: post
title:  "How to Create a Custom Error Class in Javascript"
author: Thomas
tags: [ dev, javascript ]
description: Concise example of creating and using a custom error in Javascript
---

This is going to be short and sweet.

```javascript
class MyError extends Error {
  constructor(message) {
    super(message);

    this.name = 'MyError';
  }
}

module.exports = {
  MyError,
};
```

You can throw the error like so.

```javascript
const { MyError } = require('./errors');

try {
  throw new MyError('This is my error that threw.');
} catch (err) {
  if (err instanceof MyError) {
    console.error('Instance of MyError found.');
  }

  console.error(err);
}
```