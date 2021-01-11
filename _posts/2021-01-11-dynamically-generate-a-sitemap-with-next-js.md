---
layout: post
title:  "Dynamically Generate a Sitemap With Next.js"
author: Thomas
tags: [ dev, javascript ]
description: Example of code to generate a sitemap with Next.js
---

I recently wrote some code to dynamically generate a sitemap for one of my blogs that I built using Next.js. For a long time, I was hoping to stumble across someone else who had done something similar that I could copy, but I finally gave in wrote something for myself. I wanted to share what I did in case anyone else wants some inspiration to do something similar.

I wanted my sitemap to be generated as a part of the build process. I use Vercel for my CI/CD and hosting, and they use a default build command of `npm run build`. A normal `build` script using Next.js is just `next build`. My goal was to write a custom script and have it run before Next took over and built my site, so I started by changing my `build` script to `node generateStaticPages.js && next build`. My script lives in a file called `generateStaticPages.js` in the root directory of my project. Also, the source code is [available on GitLab](https://gitlab.com/thomasstep/moneygrowsontrees). It's worth mentioning at this time that my blog is just a collection of markdown files that are converted to HTML at build time and those files all live in a folder called `_posts`. The paths for all of those posts are the same as the file names. My goal was to read the file names from the directory, format them with my base URL, add in the extra random pages I have, and write all that to a file.

The starting point for me was to retrieve the list of my posts' file names. The following function accomplished just that.
```js
const fs = require('fs');
const path = require('path');

function getPostSlugs() {
  const postsDirectory = path.join(process.cwd(), '_posts');
  return fs.readdirSync(postsDirectory);
}
```
Pretty straightforward I hope. Simply reading the directory that contains all of my files.

The next few steps were to format those files to their respecting URLs, to add any other pages that I have into the resulting list, and to spit out the text that makes up my sitemap.
```js
function generateSitemapText() {
  const files = getPostSlugs();
  const postPaths = files.map((slug) => `https://moneygrowsontrees.co/blog/${slug.replace(/\.md$/, '')}`);
  const otherPaths = [
    'https://moneygrowsontrees.co/about',
    'https://moneygrowsontrees.co/archive',
    'https://moneygrowsontrees.co/tools',
    'https://moneygrowsontrees.co/tools/compound-interest-calculator',
  ];
  const allPaths = otherPaths.concat(postPaths);
  const sitemapText = allPaths.reduce((paths, path) => paths.concat('\n', path), 'https://moneygrowsontrees.co/');
  return sitemapText;
}
```
The return of `generateSitemapText` is the content of my sitemap, so now, I just need to write that information to a file.
```js
async function generateSitemap() {
  const siteMapText = generateSitemapText();

  const staticOutputPath = path.join(process.cwd(), 'public');

  fs.writeFile(`${staticOutputPath}/sitemap.txt`, siteMapText, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('File written successfully');
    }
  });
}
```
My sitemap will now be written to `public/sitemap.txt` whenever `generateSitemap()` is called, so I finished off the script with a function invocation. If you would like to see the finished product (with some tweaks) [here is a link to that script](https://gitlab.com/thomasstep/moneygrowsontrees/-/blob/master/generateStaticPages.js). I hope this helped!