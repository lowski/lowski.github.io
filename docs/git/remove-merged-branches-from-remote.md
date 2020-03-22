---
layout: default
title: Remove merged branches from git remote
date: 2020-03-22
parent: Git
---

# Remove merged branches from git remote

```bash
git branch -r --merged | grep -v master | sed 's/origin\///' | xargs -n 1 git push --delete origin
```

It searches for remote branches that has been merged into the branch you’re currently on, skips `master`, removes `origin/` from its name and then deletes it on provided remote (`origin` in this case).
