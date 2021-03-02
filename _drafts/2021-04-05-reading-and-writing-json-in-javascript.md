---
layout: post
title:  "Reading and Writing JSON in JavaScript"
author: Thomas
tags: [ dev, javascript ]
description: Reading and Writing JSON Files in JavaScript and Node
---

File IO seems to be a topic that I normally end up Googling to find the right answer to. This last time I came across a convenient way to perform I told myself that I would instead contribute to this topic instead of only consume it. I recently needed to read and write JSON files and this is what I ended up coding and liking. Since it was one of the cleaner ways to handle this operation, I wanted to keep track of it. Here is an example script to write an object in Javascript as a JSON file.
```javascript
const fs = require('fs');
const path = require('path');

const testObject = {
  hello: 'world',
  myArray: [
    'entry1',
    'entry2',
    'entry3',
  ],
  myNestedObject: {
    nestedHello: 'nestedWorld',
  },
};

const testJsonString = JSON.stringify(testObject, null, 2);

const filePath = path.join(process.cwd(), 'test.json');

fs.writeFile(filePath, testJsonString, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('File written successfully');
  }
});
```

The `JSON.stringify(testObject, null, 2)` portion can be simplified to `JSON.stringify(testObject)` if you do not care about the output being pretty-printed. Here is an example script to read a JSON into an object.

```javascript
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'test.json');

fs.readFile(filePath, 'utf8', (err, contents) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const jsonString = JSON.parse(contents);
    console.log(jsonString);
  } catch (jsonError) {
    console.error('Error parsing JSON');
  }
});
```

The JSON is parsed in and printed in this script, and if you run the script that writes a file before the script that reads a file, then you will see an object with the same contents as the writing script printed in the reading script. Notice the `'utf8'` parameter passed into the `readFile` call. That parameter is not necessary, but I wanted to include it here just to point out that files can be encoded differently. This is how we can tell Node what type of encoding to expect. A similar parameter can be passed into `writeFile` if desired.

## Synchronous File IO

To write and read files synchronously in Node, we need to use `writeFileSync` and `readFileSync`. Instead of providing callbacks, the `*Sync` versions of these functions return only when they are done. There will be a hit on performance with this as file IO is not necessarily cheap. Here is the example script in a version that writes synchronously.
```javascript
const fs = require('fs');
const path = require('path');

const testObject = {
  hello: 'world',
  myArray: [
    'entry1',
    'entry2',
    'entry3',
  ],
  myNestedObject: {
    nestedHello: 'nestedWorld',
  },
};

const testJsonString = JSON.stringify(testObject, null, 2);

const filePath = path.join(process.cwd(), 'test.json');

try {
  fs.writeFileSync(filePath, testJsonString);
} catch (err) {
  console.error(err);
}
```

Here is the example script in a version that reads synchronously.
```javascript
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'test.json');

try {
  const contents = fs.readFileSync(filePath, 'utf8');
  const jsonString = JSON.parse(contents);
  console.log(jsonString);
} catch (err) {
  console.error(err);
}
```
