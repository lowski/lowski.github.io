---
layout: default
title: :wq vs :x in VIM
date: 2019-12-26
parent: VIM
---

# :wq vs :x in VIM

- `:wq` stands for write and quit
- `:x` stands for exit

The difference between those twos is very simple: `:x` saves changes to the file only it it has been modified, while
`:wq` changes the modification time no matter what.

Both can be used with command line arguments, i.e. to remove 2nd line in a file:

```
vim file.name +"2d|x
```
