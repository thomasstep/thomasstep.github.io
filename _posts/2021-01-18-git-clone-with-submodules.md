---
layout: post
title:  "Git Clone With Submodules"
author: Thomas
tags: [ dev ]
description: Cloning a git repository with submodules
---

If a git repo has submodules in it there are two options I use for cloning the repo and cloning the submodules in it. The first method is cloning the submodules during the original clone.
```bash
git clone --recursive <url>
```

The second method is to clone the repo and then clone the submodules.
```bash
git clone <url>
cd <repo>
git submodule update --init
```