---
layout: default
title: Undoing a rebase
parent: Git
---

# Undoing a rebase

Today I wanted to revert `HEAD` of the branch which was rebased with some other branch.

It turned out that if you use any `HEAD` changing operations like `commit`, `merge`, `rebase`, `reset`, etc. git saves starting point to `ORIG_HEAD`. Assuming you didn't perform any other operation after that faulty rebase, you can revert your change with:

```
git reset ORIG_HEAD --hard
```

If your `HEAD` has been modified since then, you will have to use `reflog`.

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
