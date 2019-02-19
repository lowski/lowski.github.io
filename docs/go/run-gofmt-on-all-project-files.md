---
layout: default
title: Run gofmt on all project files
parent: Go
---

# Run gofmt on all project files

If you'd like to run go formatter recursively on all project's files simply use:

```
gofmt -s -w .
```

If you'd like also to print the files that has been changed add `-l` option:

```
gofmt -l -s -w .
```

## Useful options

  - `-d` display diffs instead of rewriting files
  - `-l` list files where formatting differs from gofmt's
  - `-s` simplifies the code
  - `-w` writes results back
