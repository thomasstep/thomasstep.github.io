---
layout: post
title:  "NextJs Prerendering Error"
author: Thomas
tags: [ dev, javascript ]
description: Solution to prerendering error in Vercel with Nextjs
---
I recently stumbled into a problem while deploying a site on Vercel with Next.js, and I could not find any straightforward solutions to exactly what I was experiencing. The error looked something like this.

```bash
17:35:05.422  	Could not find files for /_polyfills in .next/build-manifest.json
17:35:05.428  	Unhandled error during request: Error: Minified React error #321; visit https://reactjs.org/docs/error-decoder.html?invariant=321 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
17:35:05.428  	    at Z (/vercel/xxxxxxxx/.next/serverless/pages/about.js:5281:404)
17:35:05.428  	    at Object.module.exports.xlpu.exports.useState (/vercel/xxxxxxxx/.next/serverless/pages/about.js:5287:277)
17:35:05.428  	    at Link (/vercel/xxxxxxxx/.next/serverless/pages/about.js:2086:50)
17:35:05.428  	    at d (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:36:498)
17:35:05.428  	    at $a (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:39:16)
17:35:05.428  	    at a.b.render (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:44:476)
17:35:05.428  	    at a.b.read (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:44:18)
17:35:05.428  	    at renderToString (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:54:364)
17:35:05.428  	    at render (/vercel/xxxxxxxx/node_modules/next/dist/next-server/server/render.js:3:298)
17:35:05.428  	    at Object.renderPage (/vercel/xxxxxxxx/node_modules/next/dist/next-server/server/render.js:46:1020)
17:35:05.429  	Error occurred prerendering page "/about". Read more: https://err.sh/next.js/prerender-error
17:35:05.429  	Error: Minified React error #321; visit https://reactjs.org/docs/error-decoder.html?invariant=321 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
17:35:05.429  	    at Z (/vercel/xxxxxxxx/.next/serverless/pages/about.js:5281:404)
17:35:05.429  	    at Object.module.exports.xlpu.exports.useState (/vercel/xxxxxxxx/.next/serverless/pages/about.js:5287:277)
17:35:05.429  	    at Link (/vercel/xxxxxxxx/.next/serverless/pages/about.js:2086:50)
17:35:05.429  	    at d (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:36:498)
17:35:05.429  	    at $a (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:39:16)
17:35:05.429  	    at a.b.render (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:44:476)
17:35:05.429  	    at a.b.read (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:44:18)
17:35:05.429  	    at renderToString (/vercel/xxxxxxxx/node_modules/react-dom/cjs/react-dom-server.node.production.min.js:54:364)
17:35:05.429  	    at render (/vercel/xxxxxxxx/node_modules/next/dist/next-server/server/render.js:3:298)
17:35:05.429  	    at Object.renderPage (/vercel/xxxxxxxx/node_modules/next/dist/next-server/server/render.js:46:1020)
```

There were posts talking about the Minified React error #321 at the top of the logs and other answers talking about adding a `build-manifest.json` with an empty object to troubleshoot locally. None of these solved my problem. While debugging this I noticed that I had my `node_modules` stored in git, which I normally don't do. I ran `rm -r node_modules` to delete the folder, added it to my `.gitignore`, and reinstalled. I was not meaning to solve my problem, but this is actually what did the trick. My `package-lock.json` had a diff in git for loads of changes. I am not entirely sure what happened but my guess is that my `package-lock.json` was forcing the build process in Vercel to use outdated package versions, which somehow caused my errors. There is a ton that I do not know about `package-lock`, but it has actually sparked some curiousity in me before with the integrity checks that it makes. That's a topic for another day though. Hopefully, this can help you solve your problem quicker since I could personally not find anything better already out there.
