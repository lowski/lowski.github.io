---
layout: default
title: Fork a subdirectory of a git repo
date: 2021-03-07
parent: Git
---

# Fork a subdirectory of a git repo

Git allows forking a subset of directories from the existing repo via subtree split command.

The process starts with cloning the original repo first:

```
git clone git@github.com/some/repo.git
```

At this point, it's also recommended to rename `master` branch to something like `upstream-master`, and `origin` remote to `upstream` to make syncing easier:

```
git branch -m upstream-master
git remote rename origin upstream
```

Now, the split process can be started with:

```
git subtree split --prefix=directory/to/fork -b upstream-fork
```

This will switch the repo to a new `upstream-fork` branch, that contains the content of `directory/to/fork` folder only, and can be pushed to a new remote `master` branch:

```
git checkout master
git remote add origin git@github.com/new/repo.git
git fetch origin
git push -u origin master
```

# Updating content from upstream

The update process starts with syncing `upstream-master` branch with new commits, and amending `upstream-fork` branch created earlier:

```
git checkout upstream-master
git pull upstream master
git subtree split --prefix=directory/to/fork --onto upstream-fork -b upstream-fork
```

Now the `master` branch can be rebased against the updated `upstream-fork` branch and pushed back:

```
git checkout master
git rebase upstream-fork
git push origin master
```
