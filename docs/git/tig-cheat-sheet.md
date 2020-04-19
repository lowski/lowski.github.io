---
layout: default
title: Tig - cheat sheet
date: 2020-04-19
parent: Git
---

# Tig - cheat sheet

[Tig](https://jonas.github.io/tig/){:target="_blank"} is a user-friendly text-mode interface for `git` based on [ncurses](https://en.wikipedia.org/wiki/Ncurses){:target="_blank"}.

## Navigation shortcuts

- `Enter` - open a detail view
- `k` / `j` - move up / down on the list
- `home` / `end` - jump to top / bottom on the list (`fn ->` / `fn <-` on MacOS)
- `ctrl+n` / `ctrl+p` - move next / prev on the parent view (navigates to next / prev commit on the history with open commit)
- `D` - toggle date formats
- `X` - toggle displaying commit sha
- `t` - show tree files associated with selected commit
- `R` - refresh current view
- `q` - close current view
- `Q` - clos all views
- `/` / `?` - search forward / backward
- `n` / `N` - find next / prev occurence
- `h` - show help

## Subcommands and options

- `tig path/to/file` - browse commits history for specific file
- `tig --after="YYYY-MM-DD" --before="YYYY-MM-DD"` - browse commits history within date range
- `tig --after="YYYY-MM-DD" --before="YYYY-MM-DD" -- path/to/file` - browse commits history within date range for specific file
- `tig --grep=pattern` - grep commit messages for specific pattern
- `tig blame path/to/file` - blame specific file
- `tig grep pattern` - grep tracked files for specific pattern
- `tig log` - show commits log
- `tig log path/to/file` - show commits log for specific file
- `tig refs` - browse refs (tags or branches)
- `tig stash` - browse stash
- `tig status` - show status
