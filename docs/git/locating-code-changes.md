---
layout: default
title: Locating code changes in git repo
date: 2020-11-08
parent: Git
---

# Locating code changes in git repo

## Finding a commit for a specific change

`git grep <regexp> $(git rev-list --all)` or `git rev-list --all | xargs git grep <expression>`

where:

- `git grep <expression>` search for a specific phrase, e.g. function or class name (for regex use `-e` flag like `git grep -e <regexp1>`)
- `git rev-list --all` - gives list of commit hashes

## Find the branch where commit comes from

`git branch -a --contains <commit-sha>`

where:

- `git branch -a` - includes local and remote branches
