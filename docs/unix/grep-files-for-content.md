---
layout: default
title: Grep files for content
date: 2020-05-24
parent: Unix
---

# Grep files for content

Grep can be used to search for a phrase in all files from a specific directory:

```bash
grep -inrw '/path/to/directory/' -e 'query'
```

Where each of the options stands for:

- `-i` ignore case (by default `grep` is case sensitive)
- `-n` line number
- `-r`/ `-R` recursive search
- `-w` match whole word
- `-e` pattern to look for
