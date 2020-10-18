---
layout: default
title: Current directory of aliased script in bash
date: 2020-10-18
parent: Unix
---

# Current directory of aliased script in bash

To get a current directory of a script when ran trough alias:

```bash
$(dirname $(realpath "${BASH_SOURCE[0]}"))
```

where:

- `BASH_SOURCE[0]` contains path of the script
- `realpath` prints resolved path (source of the alias)
- `dirname` returns directory portion of the path
