---
layout: post
title:  "Working With Next.js Router's Query"
author: Thomas
tags: [ dev, javascript, front end ]
description: Solution for router.query showing as undefined.
---

Just about every time that I create a Next.js page using [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes), I come across this issue. Next.js has a nice feature that will catch a wildcard in the path if a `jsx` file follows a specific naming format like `[id].jsx`. The way we can access the wildcard value is through a [hook called `useRouter`](https://nextjs.org/docs/api-reference/next/router#userouter) which outputs a `router` object containing relevant information. Under `router.query` we can find the wildcard's value with a key named the same as the file's bracketed text, so `[id].jsx` would correspond to `router.query.id`.

However, the way that Next.js works with server-side rendering, the `router.query` object will be `undefined` until the page is hydrated. If the values in `router.query` are required for a page to operate correctly, this could break functionality or result in hacky workarounds. Luckily there was enough [community discussion](https://github.com/vercel/next.js/issues/8259) around this that Next.js merged a change in late 2020 to help facilitate knowing when `router.query` is ready to be used aptly called `router.isReady`. The current version (`v12`) has this change, but I believe it became available somewhere in `v10`.

In an effort to solidify my solution to working with the Next.js Router Query object and hopefully help someone else, I wanted to share some boilerplate code for using `useRouter` and `router.isReady`.

```jsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';


function Example() {
  const router = useRouter();
  const {
    isReady,
    query: {
      id,
    }
  } = router;

  useEffect(() => {
    if (!isReady) {
      console.log('Router not ready')
      return;
    }

    console.log(`ID: ${id}`)
  }, [isReady]);


  return (
    <div>
      {id || 'Loading'}
    </div>
  );
}

export default Example;
```

I prefer object destructuring, which is why I pull all of the values I want to work with from `router` first. The `useEffect` hook only fires whenever `isReady` updates. This means it will fire on the initial page load when `router` is not ready, then again after the page is hydrated so `router.query` has its values. Any logic relying on `router.query` values can be injected inside the `if (!isReady)` block. Whenever this page is loaded there is an initial flash of `Loading` before the wildcard `id` is shown which demonstrates a small example of needing to use a default value before `router` is ready.
