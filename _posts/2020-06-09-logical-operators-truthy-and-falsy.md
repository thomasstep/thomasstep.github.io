---
layout: post
title:  "Using Javascript's Logical Operators and Understanding Truthy and Falsy"
author: Thomas
tags: [ javascript ]
image: https://thomasstep.s3.amazonaws.com/fluke0.jpg
featured: false
hidden: false
comments: true
---
Javascript supports two logical operators, the [logical AND `&&`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) and the [logical OR `||`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR).
Both of these logical operators evaluate boolean values and return boolean values.
(There are also bitwise operators for both AND `&` and OR `|` that treat their operands as 32 bit numbers and return numerical values, but I will not be focusing on those right now.)
The operands used in the logical operators are treated as booleans, and Javascript has some funky stuff going on when it comes to evaluating values as `true` or `false`, which is all thanks to [truthy](https://developer.mozilla.org/en-US/docs/Glossary/truthy) and [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

I was confused when I first encountered truthy and falsy, but it makes sense what they were going for by adding this into Javascript once you understand it all.
If you think of values like `0`, `null`, or `undefined`, they seem like false values because they are the absence of a value, and even though they are not explicitly the boolean `false` Javascript will evaluate them as such under the right conditions.
For example, `0 === ''` equates to false in Javascript but `0 == ''` equates to true (notice the amount of `=` signs).
This is because `===` does not convert the operands' types; the number `0` does not equal an empty string `''`.
However, `==` does convert the operands types and since `''` and `false` are both falsy, `0 == ''` equates to true.
The different amounts of `=` signs are called the Equality and Identity (or Strict Equality) operators and you can read more about them here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators.
The logical operators act similarly to `==` in that they convert non-boolean types to a boolean using truthy or falsy logic.

Coming from a strongly typed language background, I had trouble grappling with the fact that `0 == ''` was `true` in Javascript whereas C++ would have thrown a fit.
Alas, here we are in the magical land of Javascript.
There are 8 falsy values (check them out here https://developer.mozilla.org/en-US/docs/Glossary/Falsy) and anything that is not a falsy value is truthy.
Circling back to the logical operators, we can use this to our advantage when we are writing code to execute code based on a logical operator like we would a conditional.

Another interesting thing that Javascript does with the logical operators is only evaluate as much as it needs to.
That means if you are using `&&` and the first operand is `false`, Javascript knows that no matter what the second operand is, the expression will evaluate to `false` since AND can only be `true` if both operands are `true`.
Similarly with `||`, if the first operand is `true`, the expression returns `true` without evaluating the second operand since OR can only be `false` if both operands are `false`.
(If all of this AND and OR stuff is new or confusing, I would encourage you to learn more about boolean algebra.)

We can use this to our advantage when we are writing code to execute based on a logical operator like we would a conditional that makes sure that one condition is met before executing something else.
Let's say we have some code that returns some data that may or may not be truthy, we can use logical operators to determine what the next steps would be.

```javascript
const axios = require('axios');

function logFact(data) {
  data.used && console.log('Used fact:');
  data.used || console.log('Unused fact:');
  console.log(data.text);
}

axios.get('https://cat-fact.herokuapp.com/facts/random?amount=1')
  .then((res) => {
    logFact(res.data);
  })
  .catch((err) => {
    console.error(err);
  });
```

[The documentation for this public API is here.](https://alexwohlbruck.github.io/cat-facts/docs/)
What you should be focusing on is the logic and logging in `logFact`.
The first log that pops up on your terminal when you run this is based on `data.used`, which is either `true` or `false` according to the API documentation.
(When I was testing this out I mostly found `data.used` to be `false`, so I suggest hardcoding `data.used = true` if you want to see the logic work.)
We could even condense the logical operators in `logFact` even more just for fun:

```javascript
(data.used || console.log('Unused fact:')) && console.log('Used fact:');
```

Like I said earlier, this is an example of how to use logical operators instead of conditional statements.
The corresponding conditional statement would look something like this:

```javascript
if (data.used) {
  console.log('Used fact:');
} else {
  console.log('Unused fact:');
}
```

Another application of the above logic is using a validation function for the first operand.
Something that might look like this:

```javascript
(validateInput(input) && useInput(input)) || warnUser();
```

We can pretend that `validateInput` reaches out to a server somewhere to make sure that the user has rights to use the system and it also validates the format of all the input before returning `true`.
If anything in the validation goes wrong and `validateInput` returns `false`, then we will warn the user about the validation failure in `warnUser`; otherwise, we will let the input go through to the processing in `useInput`.

I have used logical operators with good success with checking the existence of a key in an object before using it and validating a value before using it.
Using the logical operand approach might not always be the most practical depending on the situation, but I think it can be fun to play around with them and use expressions that are not just `true` or `false` as operands.
