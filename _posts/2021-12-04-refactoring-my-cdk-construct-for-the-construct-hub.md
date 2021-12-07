---
layout: post
title:  "Refactoring My CDK Construct For The Construct Hub"
author: Thomas
tags: [ aws, dev, javascript, meta, ops ]
description: Refactoring a Javascript CDK construct to Typescript with JSII
---

[`crow-api`](https://www.npmjs.com/package/crow-api) was a Javascript only package until this weekend mostly because it was faster and easier for me to publish it that way and at the beginning it was only really meant for me. At re:Invent this past week, I heard Dr. Werner Vogels mention the [Construct Hub](https://constructs.dev/), so I decided to check it out. Turns out that there are not many community created constructs that fit the bill for being advertised there (at least not at the time of this writing). I thought it would be fun for `crow-api` to show up on the site, so I went about refactoring it to meet the requirements. In order to [become a part of the Construct Hub](https://constructs.dev/contribute), a construct needs to be published on npm, use one of a list of specific licenses, contain specific keywords in the `package.json`, and be compiled by [JSII](https://aws.github.io/jsii/).

I mostly had `crow-api` in the condition necessary to be included except for JSII compilation, which I purposefully avoided on my first pass. I wanted to get the code out the door quickly for my own use so I limited the amount of new technology I needed to learn (`crow-api` was the first time I used the AWS CDK). This meant that I would need to learn JSII and Typescript but only enough to slightly refactor what I already had.

First thing was JSII and here are the commands I used to get it set up.

```bash
npm install --save-dev jsii-config
npx jsii-config
```

After that came the difficult part of refactoring Javascript to Typescript. After multiple hours in the trenches I completed the task although not gracefully. This was my first experience with Typescript and I am not a fan. I can not really give a great overview of this refactor since I am sure that the intricacies differ between each codebase, and there are much better, more experienced Typescript devs out there for explaining how to migrate from JS to TS. What I mainly needed to refactor was adding interfaces, which I had luckily documented quite well in the README, and providing the correct types to a certain few variables.

Once I was able to convert everything over, there were a few more commands I ran to finish my work up and ship the new package.

```bash
npm install --save-dev jsii-build jsii-pacmak jsii-release
npx jsii-build
npx jsii-pacmak
npx jsii-release
```

Of course, each has their own caveats. `jsii-build` has its own set of rules and errors that popped up, which required me to write "better" Typescript to pass. `jsii-pacmak` was fortunately straightforward after completing everything that `jsii-build` yelled at me about. `jsii-release` required me to create a PyPi account since it uses the account's username and password to publish `pip` packages, but I already had my npm registry credentials set up since that is where `crow-api` lived beforehand.

Once my packages were published, I patiently waited for Construct Hub to pick them up. After a while, I realized that something was not right because nothing was showing up on their site. I made an [issue on GitHub](https://github.com/cdklabs/construct-hub/issues/640) as noted in the contribution page's FAQs. It turns out that my packages were missing an important piece: the `.jsii` file. The issue has more details as to why that file was left out. Once I [added it back in](https://github.com/thomasstep/crow-api/commit/13535ba88c8b759c91e37d12127f63469fc48fde) and republished, `crow-api` popped up on [Construct Hub](https://constructs.dev/packages/crow-api) 🎉

And that's all. I didn't use a cumbersome project management tool or anything else, just the `jsii` packages. Would I do this again? No. At least not refactor from Javascript to Typescript because that was annoying as could be. Moving forward I will probably just use Typescript and `jsii` by default so I will not have to worry about refactoring. My goal for `crow-api` now is to write some tests for it and polish the Typescript. Since the construct is being advertised now on another channel, I feel it is my duty to write tests for the comfort and safety of its users and I knew I should have done that from the start. Polishing up the Typescript is just because I wanted to publish quickly and move the deeper Typescript learning phase to a later date.

If you have made it this far, I hope you have a better idea of what refactoring your existing CDK construct for the Construct Hub might require. Feel free to reach out with any questions and I will do my best to help you through them. [Here is a link to the pull request](https://github.com/thomasstep/crow-api/pull/1) I made in case anyone would like to see the code changes. Thanks for reading!