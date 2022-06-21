---
layout: post
title:  "Using Mustache To Preprocess HTML Templates"
author: Thomas
tags: [ dev, javascript, front end ]
description: Code example of how to use Mustache and HTML templates
---

While working on one of my recent projects I came across the need to templatize some of the information that I was using in HTML files. I am attempting to make my front end without any frameworks like Next.js but instead with simple HTML, CSS, and vanilla Javascript. We'll see how everything turns out but that'll be a topic of discussion for another post.

Years ago I had heard of something called Mustache which is a templating engine somewhat similar to something like Jinja. I started looking into it because I wanted something quick and lightweight to setup. I am not using anything special from the Mustache syntax other than the double brackets (`{{ }}`) to preprocess my HTML files. Here is what one of my templates might look like.

{% raw %}
```html
<html>
  <head>
  </head>
  <body>
    <h1>Hello {{planet}}</h1>
  </body>
</html>
```
{% endraw %}

The goal is to have a central configuration that all of my templates can read from and pass to Mustache. The keys in the configuration are simply matched with the template and the values are passed in. If my configuration looked like `{ "planet": "world" }`, then my resulting HTML should look like the following.

```html
<html>
  <head>
  </head>
  <body>
    <h1>Hello world</h1>
  </body>
</html>
```

I also wanted to keep my templated HTML files in a folder and then write the processed HTML files to another. What I ended up with was a recursive function that traverses through a directory structure, processes the templates, and writes the result to a different folder. (Also note that I was using Typescript with the npm package `mustache`.)

```typescript
function processHtmlTemplates(templateDirectory: string, currentChildDirectory: string, htmlDirectory: string) {
  const currentDirectory = `${templateDirectory}${currentChildDirectory}`;
  const directoryEntries = fse.readdirSync(currentDirectory, { withFileTypes: true });
  // Only want to template and copy over .html files
  const files = directoryEntries
    .filter((dirent: any) => dirent.isFile() && dirent.name.endsWith('.html'))
    .map((dirent: any) => dirent.name);
  const directories = directoryEntries
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name);
  files.forEach((file) => {
    const templatePath = `${currentDirectory}/${file}`;
    const htmlChildDirectory = `${htmlDirectory}${currentChildDirectory}`;
    const htmlPath = `${htmlChildDirectory}/${file}`;
    const template = fse.readFileSync(templatePath, 'utf8');
    const staticPage = mustache.render(template, templateValues);
    fse.mkdirSync(htmlChildDirectory, { recursive: true });
    fse.writeFileSync(htmlPath, staticPage);
  });
  directories.forEach((directory) => {
    // Recursion stops when the file tree ends
    processHtmlTemplates(templateDirectory, `${currentChildDirectory}/${directory}`, htmlDirectory);
  });
}
```

I realize that the function signature might seem slightly weird from the start so here is what the initial call ended up looking like.

```typescript
const templateDirectory = 'templates';
const htmlDirectory = 'html';
processHtmlTemplates(templateDirectory, '', htmlDirectory);
```

After running this function I was successfully able to preprocess my HTML files before publishing them.
