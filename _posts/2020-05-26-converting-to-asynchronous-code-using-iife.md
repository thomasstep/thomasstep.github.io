---
layout: post
title:  "Converting to Asynchronous Code Using IIFE"
author: thomas
tags: [ javascript ]
image: https://thomasstep.s3.amazonaws.com/dramaticMountain1.jpg
featured: false
hidden: false
comments: true
---
I have not seen too much written about IIFEs in Javascript, but I think that they are a super useful tool for converting chunks of synchronous code to excute asyncronously.

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
]).then((nums) => {
  console.log(nums);
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

Here I'm using functions, but let's pretend that each function represents statements that reach out to DBs and other APIs and take a while to resolve.
For fun I'll say that `func1` and `func2` reach out to a REST API, `func3` reaches out to a GraphQL API, `func4` reaches out to a DB.
We'll go ahead and say that these functions each represent 20 lines of code or so that connect to the various endpoints and get the correct data because using IIFEs looks a lot better that way.

Now transitioning the previous code snippet to IIFEs we have something that looks like this.

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

Again, try to think of each function that I am calling in the IIFEs as being multiple statements long and not simply a function.
I am trying to highlight what IIFEs are, not what goes in them.
Also, please note that the IIFE that I just wrote is unlike the original Hello World one at the top in that this most recent one was `async`.
With that disclaimer, I hope you ran both of the last two snippets.
If you decided to not run those snippets and instead are just reading along, let me share with you what I got.

```bash
# Awaiting run
10002.1091 ms
Result: 10

# IIFE run
4001.5615 ms
Result: 10
```

The time it takes to get through all of that logic and communication goes from ~10 seconds down to ~4 seconds (or the longest set Timeout).
Remember, I am trying to think of it as reaching out to two different APIs and a DB which took me a total of 10 seconds before the IIFE conversion.
This gets more and more powerful once you start writing code in chunks that process data independently of other chunks, converting those independent chunks into IIFEs, and then running those IIFEs in parallel.
If you can unwind those independent pieces and put the dependent ones into IIFEs, you can significantly speed up your processing time.
I can see this being incredibly useful to applications that crunch a ton of data (data science?) or reach out to multiple different services at once before doing anything with the returned data.
I have personally used it with success on code that reaches out to multiple APIs at once and then acts on that data once all of the resources have returned.
I have also used it with success while looping through some large arrays with `map`, `reduce`, `forEach`, etc.

Have you ever used this type of approach?
Are there any potential downfalls of doing something like this?
Did you know about IIFEs and have you used them before?

I feel like I see a lack of people writing about using them, but I think they are fun and definitely beneficial.
