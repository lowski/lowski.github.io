---
layout: default
title: Undoing a Git rebase
date: 2019-02-15
parent: Git
---

# Undoing a Git rebase

Today I wanted to revert `HEAD` of the branch which was rebased with some other branch.

It turned out that if you use any `HEAD` changing operations like `commit`, `merge`, `rebase`, `reset`, etc. git saves starting point to `ORIG_HEAD`. Assuming no other operation was performed after the faulty rebase, you can revert the change with:

```
git reset ORIG_HEAD --hard
```

If `HEAD` pointer has been modified, you will need to use `reflog`.

## Reflog

`Reflog` stands for reference logs and it's used by git to record changes of branches' tips in the local repository.

To display recent changes to the `HEAD` for current branch simply run:

```
git reflog
```

To revert `HEAD` based on one of the reflogs just run `reset --hard`:

```
git reset HEAD@{2} --hard
```
