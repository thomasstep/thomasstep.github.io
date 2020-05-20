---
layout: post
title:  "Converting to Asynchronous Code Using IIFE"
author: thomas
categories: [ javascript ]
image: https://thomasstep.s3.amazonaws.com/dramaticMountain1.jpg
featured: false
hidden: true
comments: true
---
I have not seen too much written about IIFEs, but I think that they are a super useful tool for converting chunks of synchronous code to excute asyncronously.

In a nutshell, an [IIFE is just a function that you execute at the same time you define it](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).
The following is an example of a Hello World function running as a normal function and as an IIFE.

```javascript
// Normal function
function helloWorld() {
  console.log('Hello World from normal function!');
}

helloWorld();

// IIFE
(() => {
  console.log('Hello World from IIFE!');
})();
```

Go ahead and copy paste that into a file and run it, I'll wait.
You should see
```bash
Hello World from normal function!
Hello World from IIFE!
```

When I first learned about this syntax I did not think too much about it.
If you are simply wrapping static statements, why not just write out the statements?
If there is some sort of parameter that you want to pass as a variable, why not just make it a function and call it normally?
I still have not personally come across a use case for IIFEs in those contexts; however, I have come across use cases for using it to convert synchronous code to run asynchronously.

Before I go any further, I am assuming that you know about [async code in JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await), specifically Node, and [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
The whole topic of async code is a bigger concept in and of itself, so if you do not know much about it, then I suggest learning that first.
If you already know about how async programming works, then `Promise.all` will not be hard to understand.
It is simply a way to block execution until the `Promises` you provide the function resolve.
An example looks like this.

```javascript
let i = 0;

async function echo(string) {
  console.log(string);
  i += 1;
  return i;
}

Promise.all([
  echo('first'),
  echo('second')
]).then((num) => {
  console.log(num);
});
```

You can run this, but don't expect anything profound to log.
This is what I got
```bash
first
second
[ 1, 2 ]
```

All I am trying to illustrate is that `Promise.all` takes in an iterable object and resolves an array of all the resolved `Promises` you gave it.
Easy.
Next comes the fun part.

Let's say I have some synchronous code that takes "forever" to run.

```javascript
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function func1() {
  await sleep(1000);
  return 1;
}

async function func2() {
  await sleep(2000);
  return 2;
}

async function func3() {
  await sleep(3000);
  return 3;
}

async function func4() {
  await sleep(4000);
  return 4;
}

async function main() {
  const startTime = process.hrtime();

  const num1 = await func1();
  const num2 = await func2();
  const num3 = await func3();
  const num4 = await func4();

  const [endS, endNs] = process.hrtime(startTime);
  const endTime = endNs / 10 ** 6 + endS * 1000;
  console.log(`${endTime} ms`);
  console.log(`Result: ${num1 + num2 + num3 + num4}`);
}

main();
```

Those functions represent statements.

Now transitioning to IIFEs we have something that looks like this.

```javascript
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function func1() {
  await sleep(1000);
  return 1;
}

async function func2() {
  await sleep(2000);
  return 2;
}

async function func3() {
  await sleep(3000);
  return 3;
}

async function func4() {
  await sleep(4000);
  return 4;
}

async function main() {
  const startTime = process.hrtime();
  Promise.all([
    (async () => {
      const num1 = await func1();
      const num2 = await func2();
      return num1 + num2;
    })(),
    (async () => {
      const num3 = await func3();
      return num3;
    })(),
    (async () => {
      const num4 = await func4();
      return num4;
    })(),
  ]).then(([num1plus2, num3, num4]) => {
    const [endS, endNs] = process.hrtime(startTime);
    const endTime = endNs / 10 ** 6 + endS * 1000;
    console.log(`${endTime} ms`);
    console.log(`Result: ${num1plus2 + num3 + num4}`);
  });
}

main();
```

