---
layout: post
title:  "I Published My First npm Package"
author: Thomas
tags: [ dev, javascript, meta ]
description: TBD
---

I recently published my first `npm` package and it was easier than I thought it would be. I had a quick and dirty idea of a package that I wanted to exist but couldn't find so I wrote some code to handle what I needed. I was my first customer before my package was even published. To test out my package locally I ran `npm link my-package` in another `Node` project that would be consuming my package. From there I was able to test my code and make sure everything functioned as intended.

The next step was to publish. After two commands my package was live in the `npm` repository: `npm login` and `npm publish`. That's it.

There are some final words I wanted to say regarding my package's `package.json`. There are four keys that I needed to pay attention to before I published my package and they were `main`, `keywords`, `files`, and `version`.

### `main`

`main` represents the file path to the main `Javascript` code that is the package's entry point. Running `npm init` defaults this to `index.js`, but my main file was in another folder and named file. The value for this key is a string representing a path from the root of the project to the entry point file.

### `keywords`

`keywords` is solely for discoverability. It's like SEO for `npm`. I found some other packages similar to mine and added some of their keywords so I would be grouped with their packages. The value for this key is an array of strings.

### `files`

I used `files` because I hosted other code in my package's repo that I used to test it out. Using `files` tells `npm` specifically which files and paths should be included in the package. This helps keep the size in check. Dependency bloat is something that most `Javascript` developers know too much about. The value for `files` is an array of strings that represent files and paths that should be included.

### `version`

`version` is incredibly important for publishing packages. To publish new changes for a package, I first needed to increment the version following [semantic versioning](https://semver.org/). The value for this key is a string representing the version as `major.minor.patch`.

If you would like to see my package, it is hosted on [`npm` as `crow-api`](https://www.npmjs.com/package/crow-api) and the [code is on GitHub](https://github.com/thomasstep/crow-api).