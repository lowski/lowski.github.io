---
layout: default
title: Search and navigation cheat sheet for VIM
date: 2020-03-08
parent: VIM
---

# Search and navigation cheat sheet for VIM

- `/` - search forward
- `?` - search backward
- `n` - move forward to the next result
- `N` - move backward to the next result
- `*` - search word under the cursor (exact match)
- `#` - search word under the cursor (exact match) in opposite direction / backward
- `g*` - search for word under the cursor (prefix match)
- `g#` - search for prefix under the cursor in opposite direction / backward (prefix match)
- `/` or `?` followed by `↑` or `↓` - show search history
- `/` followed by `Ctrl + r` and then `Ctrl + w` - copy word under cursor to command line mode for searching
- `ctrl-g` – jump to the next occurrence of the pattern while staying in command mode
- `ctrl-t` – jump to the next occurrence of the pattern in opposite direction / backward while staying in command mode

## Commands

- `:%s/some_pattern//n` - count occurrences
- `:%s/from_text/to_text/g` - replace `from_text` with `to_text`
- `:%S/company/organization/g` - replace `company` with `organization` while preserving casing (`company` -> `organization`, `Company` -> `Organization`, etc.). It requires [vim-abolish](https://github.com/tpope/vim-abolish){:target="_blank"} plugin.
