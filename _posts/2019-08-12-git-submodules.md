---
layout: post
title:  "Git Submodules"
author: Thomas
tags: [ dev ]
---
Git submodules are not useful if you are not creating a very large or integrated project. I think that is probably why I did not use them in college. I like to think of git submodules like packages. Loosely like `pip install` for git. By adding a submodule to your git repo you are essentially copy and pasting code into your repo without actually copy and pasting. This means that you don't have to maintain that code; you just run `git submodule update` to get the latest code. I could see this concept being useful for a project with multiple repos and teams. The project could break the pieces out as different repos and then integrate them together using submodules in a larger project. It is worth noting that submodules are taken as a commit hash. If a repo is updated, you will need to run `git submodule update` to update that code. Alternatively, you can go into the submodule's root directory and `git pull` then go through the normal `add`, `commit`, `push` workflow. I think this is more a pro than a con because you will never have to worry about the submodule's team changing something that you rely on in your code without you manually updating it. At least as long as you review the code changes.
