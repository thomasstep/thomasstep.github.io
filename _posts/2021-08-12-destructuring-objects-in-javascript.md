---
layout: post
title:  "Destructuring Objects in Javascript"
author: Thomas
tags: [ dev, javascript ]
description: Examples of destructuring objects in Javascript and Node.js
---

I first learned about destructuring objects a few months into learning about Javascript. I might have been late to the party but I am glad I joined. Destructuring is one of my favorite features of the language because it looks and feels so clean and succinct. The [official definition](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) is unpacking values from array or properties from objects into distinct variables. Today, I only want to go over a few examples with objects, but maybe I will make another post with examples for destructuring arrays.

The first and easiest to understand example is simple value extraction. Given the key names of a certain object, we can pull out the values of those keys for operation.

```javascript
const initialObject = {
  hello: 'world',
  other: 'iamavalue',
  numberValue: 42,
};

const {
  hello,
  other,
  numberValue,
} = initialObject;

console.log(hello); // 'world'
console.log(other); // 'iamavalue'
console.log(numberValue); // 42
```

Seems simple enough. The syntax also allows us to give those new `const`s different names instead of the default names corresponding to the keys. Providing new names might look a bit weird at first but starts to become second nature.

```javascript
const initialObject = {
  hello: 'world',
  other: 'iamavalue',
  numberValue: 42,
};

const {
  hello: planet,
  other: whatAmI,
  numberValue: randomNumber,
} = initialObject;

console.log(planet); // 'world'
console.log(whatAmI); // 'iamavalue'
console.log(randomNumber); // 42
```

The key's name is on the left of the colon (`:`) and the new variable's name is on the right. Destructuring this way sometimes makes more sense if the key names are generic or if multiple objects with the same keys are being destructured since the `const` variable names would otherwise conflict. What if our assumptions about the object's contents are false? At the top level, the value is returned as `undefined`, but there is a way to provide default values.

```javascript
let conditionalObject = {};

if (Math.random() > 0.5) {
  conditionalObject = {
    hello: 'world',
    other: 'iamavalue',
    numberValue: 42,
  };
}

const {
  hello,
  other = 'defaultOtherString',
  numberValue: randomNumber = 3,
} = conditionalObject;

console.log(hello); // 'world' || undefined
console.log(other); // 'iamavalue' || 'defaultOtherString'
console.log(randomNumber); // 42 || 3
```

Let's say you have an object that is conditionally populated with properties; attempting to destructure those properties could be a hit or a miss. The example above shows what happens if we do not provide a default value (variable is `undefined`), how to provide a default value (`other = 'defaultOtherString'`), and how to provide a default value to a renamed property (`numberValue: randomNumber = 3`). The syntax for providing a default value looks the same as providing a default value to a function, so we add an equals sign (`=`) and the default value to the right side. The syntax for providing a default value to a renamed variable name needs to follow a certain order, but the order is intuitive. First, we provide a new variable name with the colon (`:`) syntax like we saw before, then we tack on the default value with its syntax.

What if we want to overwrite the value of an existing variable with a value retrieved while destructuring? That is also possible by assigning without declaring. The syntax does look a little different, but it is an alternative method of destructuring that can be put to good use. I have used something similar to this in the past to override existing variables that were previously defined as a way of using default values. This also works well for destructuring in a condition but declaring the variable with `let` outside of the condition's block.

```javascript
let hello;
let whatAmI;
let randomNumber;

const initialObject = {
  hello: 'world',
  other: 'iamavalue',
};

({
  hello,
  other: whatAmI,
  numberValue: randomNumber = 88,
} = initialObject);

console.log(hello); // 'world'
console.log(whatAmI); // 'iamavalue'
console.log(randomNumber); // 88
```

Putting parentheses around the destructuring statement executes this code as a statement instead of seeing the `{ ... }` on the left of the equals (`=`) as a block. It is also worth noting that a semicolon (`;`) needs to be placed after the preceding statement or the destructuring will be viewed as trying to call a function. The previous syntax additions that I have examples for are also available: renaming variables and providing default values.

Destructuring also works without statically defining the key names we want to pull out. Using similar square bracket (`[ ... ]`) notation as we would for accessing an object's values, we can destructure using dynamic values.

```javascript
const initialObject = {
  hello: 'world',
  other: 'iamavalue',
  numberValue: 42,
};

let firstProperty = 'hello';
let secondProperty = 'other';

if (Math.random() > 0.5) {
  firstProperty = 'numberValue';
  secondProperty = 'hello';
}

const {
  [firstProperty]: first,
  [secondProperty]: second = 'defaultValue',
} = initialObject;

console.log(first);
console.log(second);
/**
 * Either 'world' and 'iamavalue'
 * or 42 and 'world'
 */
```

Destructuring this way requires us to provide new variables names and optionally provide default values (in this example the default behavior would not be encountered, I simply wanted to show that it is an option). ***CHECK THAT THIS IS TRUE***.

So far I have only shown examples with a flat object, but what about destructuring more complex nested objects?

```javascript
const initialObject = {
  hello: 'world',
  other: 'iamavalue',
  numberValue: 42,
  nestedObject: {
    nestedKey: 'nestedValue',
    ECHO: {
      ECHo: {
        ECho: {
          Echo: 'echo',
        },
      },
    },
    unusedNestedKey: 901,
  },
};

const {
  hello,
  nestedObject: {
    nestedKey,
    ECHO: {
      ECHo: partialEchoObject
    }
  },
} = initialObject;

console.log(hello); // 'world'
console.log(nestedKey); // 'nestedValue'
console.log(partialEchoObject); // ECho: { Echo: 'echo' }
```

As we can see, it is fairly straightforward to destructure nested objects. One thing to note is that we do not have to destructure until we hit the end of the nested objects, which I demonstrated with the nested echoing objects.

One final use for this syntax that I wanted to highlight is copying an object but "removing" certain keys from the copy. Instead of using `delete`, we can use a combination of destructuring and spreading to pull out those unwanted keys.

```javascript
const initialObject = {
  hello: 'world',
  other: 'iamavalue',
  numberValue: 42,
};

const {
  hello,
  ...rest
} = initialObject;

console.log(hello); // 'world'
console.log(rest); // { other: 'iamavalue', numberValue: 42 }
```

The value placed in the `rest` variable, which is spread, is the `initialObject` minus the properties that have already been used in the destructuring (`hello` in this example). I love finding excuses to use this nifty pattern. Note that `...rest` does not have a comma (`,`) after it, this is done on purpose.

These are all examples that I have personally used to destructure objects in Javascript. Other patterns exist that I have not used, but I believe these are some of the more common ones. Arrays can also be destructured, but that is a topic for another day. Hopefully, this gave you some context and new tools to add to your kit.
