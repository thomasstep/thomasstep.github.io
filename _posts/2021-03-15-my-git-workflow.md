---
layout: post
title:  "My Git Workflow"
author: Thomas
tags: [ dev ]
description: Explaining and demoing my git workflow for writing features
---
I wanted to publish my opinionated `git` workflow when it comes to writing features and handling `git` commit history. I hope that someone can gain a new set of `git` commands or even adopt my workflow out of this. This workflow is assuming that the repo is remotely hosted (i.e. GitHub) and that the team working on the code base uses feature branches and pull requests to merge in new code.

I start my work on the `main` branch and running `git fetch` and `git pull origin main`. This updates my main branch and gives me any updates that have been made in the remote repo that I do not already see. Next comes the branching with `git checkout -b feature/my-feature`. As I am working on my feature, I make commits. Like, a lot of commits. I used to save my video games anytime I did something good, so why should I not save my work if it gets me closer to acceptance criteria? I make sure the commit messages are organized and understandable to me. The reason for this is because I might need to roll back to a previously good state and I want to make it easy on my future self to find where that is.

After completing and polishing my work I checkout `main` and pull it from remote to update it, then I run a rebase command `git rebase -i main`. In the rebase, I squash all of my commits into a single commit and fix any conflicts as they arise. Using this strategy, I limit the commit clutter in my pull request and `main`'s history.

After polishing everything up, I make a final push (might have to be a force push) and create a pull request. If there are suggested changes for the code that come as suggestions during the pull request, then I make individual commits for each change and push. Don't rebase after creating a pull request. Rebasing commits after a pull request has been made or others are using a branch can make merge conflicts difficult to resolve because rebasing is rewriting commit history. Not to mention, it doesn't look great when I have to force push updates.

Here is what that looks like in a flow chart:

![Git workflow with rebasing](/assets/img/git-workflow.png)

Rebasing could potentially be a blog post in and of itself, but I'll try to condense it down quickly. When we rebase a branch, we are taking the commits we have added since the last common commit and pasting them on top of the branch we are rebasing off of. If the branch we are rebasing off of is the same one we originally branched off of, there is effectively no change. The problems come in when we rebase onto a branch with different commits than ours because there are potential conflicts. First I will walk through a rebase on a branch with no conflicts, then I'll walk through a rebase with conflicts. The setup I will be using to demo this is a brand new `git` repo with one file and one commit on the `main` branch to start with.
```bash
$ git branch
* main
$ ls
test.txt
$ cat test.txt
this
is
a
test
file
```

First comes the branching and editing of commits
```bash
$ git checkout -b feature/add-text
Switched to a new branch 'feature/add-text'
$ echo "new" >> test.txt
$ git add .
$ git commit -m "Added the word 'new'"
[feature/add-text 7a6c68b] Added the word 'new'
 1 file changed, 1 insertion(+)
$ echo "text" >> test.txt
$ git add .
$ git commit -m "Added the word 'text'"
[feature/add-text 48392c2] added the word 'text'
 1 file changed, 1 insertion(+)
$ cat test.txt
this
is
a
test
file
new
text
```

Now I have two commits on my feature branch and my feature is complete, so I will rebase.
```bash
$ git rebase -i main
```

After running the rebase command, I am faced with some text in my default `git` text editor. (Run `git config --global core.editor` to see what the is. If nothing is returned, `git` uses `vi` as the default editor. We will need to use common `vi` commands from here on out to alter, save, and exit rebase's interactive prompts.)
```bash
pick 7a6c68b Added the word 'new'
pick 48392c2 Added the word 'text'

# Rebase 3427361..48392c2 onto 3427361 (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

To keep this article to a decent length, what I want to do is squash all commits after my first commit by changing `pick` to `s` or `squash`. This is what I almost always do although there are numerous options and routes to take as you can see. There are tutorials out there that go over rebase and these options in length. When I'm done, the file will look like the following.
```bash
pick 7a6c68b Added the word 'new'
s 48392c2 Added the word 'text'
```

After saving and quitting `vi` (`:wq`), I am faced with yet another file.
```bash
# This is a combination of 2 commits.
# This is the 1st commit message:

Added the word 'new'

# This is the commit message #2:

Added the word 'text'

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Mon Jan 25 17:29:34 2021 -0600
#
# interactive rebase in progress; onto 3427361
# Last commands done (2 commands done):
#    pick 7a6c68b Added the word 'new'
#    squash 48392c2 Added the word 'text'
# No commands remaining.
# You are currently rebasing branch 'feature/add-text' on '3427361'.
#
# Changes to be committed:
# modified:   test.txt
#
```

In this file, I have the option of altering the commit message. Since I am squashing down to one commit, all of the squashed commit messages and the original commit message are shown in this file. Here we can change to file to whatever we want and any text present when the file is saved and quit will become to new commit's message. My file looks like this before saving and quitting.
```bash
Added the words 'new' and 'text'
```

After saving and quitting, I am brought back to the terminal.
```bash
$ git rebase -i main
[detached HEAD fa7c054] Added the words 'new' and 'text'
 Date: Mon Jan 25 17:29:34 2021 -0600
 1 file changed, 2 insertions(+)
Successfully rebased and updated refs/heads/feature/add-text.
```

Now is when I would make my final push and create a pull request for my feature branch.

A rebase with conflicts will look slightly different and require different `git` commands. I'll set up my feature branch with the same file, but this time, my `main` branch will have had a commit added onto it with new changes to the same file. `main`'s `test.txt` will look like the following.
```bash
this
is
a
test
file
this is new text from main
```

When I run the rebase command, the first screen that pops up will be the same as before, so I will perform the same actions. However, when I save and quit the screen, I run into new output in the terminal.
```bash
$ git rebase -i main
Auto-merging test.txt
CONFLICT (content): Merge conflict in test.txt
error: could not apply 9a31390... Added the word 'new'
Resolve all conflicts manually, mark them as resolved with
"git add/rm <conflicted_files>", then run "git rebase --continue".
You can instead skip this commit: run "git rebase --skip".
To abort and get back to the state before "git rebase", run "git rebase --abort".
Could not apply 9a31390... Added the word 'new'
```

I'll need to solve the merge conflicts and either run `git add .` then `git rebase --continue` to finish the rebase or use one of the other options. I typically run with the `--continue` flag unless something bad happened in which case I run `git rebase --abort` and start all over again. For this demo, I fixed the merge conflicts by allowing both lines through.
```bash
this
is
a
test
file
this is new text from main
new
```

After adding the file to `git` and continuing the rebase, I come up with a screen that asks me to enter a commit message for the commit that I just rebased.
```bash
Added the word 'new'

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# interactive rebase in progress; onto 9fed945
# Last command done (1 command done):
#    pick 9a31390 Added the word 'new'
# Next command to do (1 remaining command):
#    squash 000a13a Added the word 'text'
# You are currently rebasing branch 'feature/add-text' on '9fed945'.
#
# Changes to be committed:
# modified:   test.txt
#
```

A simple save and quit keeps me moving along. The next screen is one that we have seen before for combining the two commit messages that will become one commit. I perform the same actions, save, and quit. The rebase is now complete, so I will make my final push and create a pull request for my feature branch.

