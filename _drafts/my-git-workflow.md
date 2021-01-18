---
layout: post
title:  "My Git Workflow"
author: Thomas
tags: [ dev ]
description: TBD
---

make feature branch
make commits; i mean a lot of commits, make the messages organized and make a commit anytime you reach a better point in the code so you can always go back to a past stage
when I'm done, rebase
pull the base branch
rebase feature branch again to get the new updates
push and pr

I wanted to publish my opinionated `git` workflow. I have not even seen anyone blatantly put their workflow out there, and I hope that someone can gain a new set of `git` commands or even adopt my workflow. This workflow is assuming that the repo is remotely hosted (i.e. GitHub) and that the team working on the code base uses feature branches and pull requests to merge in new code.

I start my work on the `main` branch and running `git fetch` and `git pull origin main`. This updates my main branch and gives me any updates that have been made in the remote repo that I do not already see. Next comes the branching with `git checkout -b feature/my-feature`. As I am working on my feature, I make commits. Like, a lot of commits. I used to save my video games anytime I did something good, so why should I not save my work if it gets me closer to acceptance criteria? I make sure the commit messages are organized and sense. The reason for this is because I might need to roll back to a previously good state and I want to make it easy on my future to find where that is.

After completing and polishing my work I run a rebase command `git rebase -i main`. If I have not pulled `main` in a while, then all I plan on doing is squashing my commits for the time being. If I have an updated `main`, then I don't change the `git` history at all, I just rebase and fix conflicts as they arise. If I had not pulled in while, now I checkout main and pull. After updating `main`, I re-checkout my feature branch and rebase again fixing conflicts as they arise. The reason I try to squash my commits before I rebase on an updated `main` branch is because fixing merge conflicts one commit at a time can be tedious and a little confusing. I would much rather squash my commits first and then rebase on an updated `main`. Using this strategy, I am able to limit the amount of commit history I have to go through during the rebase.

At the end of all of this, I push my feature branch and create a pull request. If there are suggested changes for the code, then I make individual commits for each change and push. Rebasing commits after a pull request is made or others are using my branch can make merge conflicts difficult to resolve. Not to mention, it doesn't look great when I have to force push updates.

Here is what that looks like in a flow chart:

** Add flow chart here **