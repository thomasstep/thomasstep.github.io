// Normal

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// async function func1() {
//   await sleep(1000);
//   return 1;
// }

// async function func2() {
//   await sleep(2000);
//   return 2;
// }

// async function func3() {
//   await sleep(3000);
//   return 3;
// }

// async function func4() {
//   await sleep(4000);
//   return 4;
// }

// async function main() {
//   const startTime = process.hrtime();

//   const num1 = await func1();
//   const num2 = await func2();
//   const num3 = await func3();
//   const num4 = await func4();

//   const [endS, endNs] = process.hrtime(startTime);
//   const endTime = endNs / 10 ** 6 + endS * 1000;
//   console.log(`${endTime} ms`);
//   console.log(`Result: ${num1 + num2 + num3 + num4}`);
// }

// main();

// IIFE

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// async function func1() {
//   await sleep(1000);
//   return 1;
// }

// async function func2() {
//   await sleep(2000);
//   return 2;
// }

// async function func3() {
//   await sleep(3000);
//   return 3;
// }

// async function func4() {
//   await sleep(4000);
//   return 4;
// }

// async function main() {
//   const startTime = process.hrtime();
//   Promise.all([
//     (async () => {
//       const num1 = await func1();
//       const num2 = await func2();
//       return num1 + num2;
//     })(),
//     (async () => {
//       const num3 = await func3();
//       return num3;
//     })(),
//     (async () => {
//       const num4 = await func4();
//       return num4;
//     })(),
//   ]).then(([num1plus2, num3, num4]) => {
//     const [endS, endNs] = process.hrtime(startTime);
//     const endTime = endNs / 10 ** 6 + endS * 1000;
//     console.log(`${endTime} ms`);
//     console.log(`Result: ${num1plus2 + num3 + num4}`);
//   });
// }

// main();
