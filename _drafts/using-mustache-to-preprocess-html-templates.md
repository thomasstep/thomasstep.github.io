---
layout: post
title:  "Using Mustache To Preprocess HTML Templates"
author: Thomas
tags: [ dev, javascript, webdev ]
description: Code example of how to use Mustache and HTML templates
---


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

```typescript
const templateDirectory = 'templates';
const htmlDirectory = 'site';
processHtmlTemplates(templateDirectory, '', htmlDirectory);
```
