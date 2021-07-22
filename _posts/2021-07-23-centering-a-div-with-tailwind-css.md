---
layout: post
title:  "Centering a Div With Tailwind CSS"
author: Thomas
tags: [ dev ]
description: Use CSS to position an element in the center of a web page
---

Somehow centering a `div` still seems to trouble people. I have mostly been working with Tailwind CSS lately and I wanted to quickly share how I center a div with Tailwind. I'll first show the examples and then describe what is happening.

```html
<div class="flex flex-row min-h-screen justify-center items-center">
  I am centered
</div>
```

The same classes work with either `flex-row` or `flex-col`, which set the flexbox's main axis either horizontally or vertically, respectively. Setting the height with `min-h-screen` is just an easy way to take up an entire screen's view. The final two classes are where I needed to learn a tiny amount of CSS.

I played around with justification and alignment far too long before I finally looked into what they affect. `justify-content` refers to how the content should be positioned along the main axis, while `align-content` refers to how the content should be positioned along the cross axis. [Justifying content](https://tailwindcss.com/docs/justify-content) and [aligning content](https://tailwindcss.com/docs/align-content) with Tailwind are simple one-to-one mappings between their classes and the actual CSS, so once I understood how the CSS worked, I understood how the utility worked.
