---
layout: default
title: Running commands concurrently with bash
date: 2020-04-12
parent: Unix
---

# Running commands concurrently with bash

There are cases when it's useful to run multiple commands concurrently without installing extra dependencies. In bash, it can be achieved with running multiple commands in the background.

Here is a little script that starts 2 commands:

- `cmd foo bar`
- `cd baz && start cmd` (for this particular command, extra brackets are required in order to correctly interpret `&&` characters)

```bash
#!/usr/bin/env bash

cmds=("cmd foo bar" "(cd baz && start cmd)")
pids="";

for cmd in "${cmds[@]}"; do {
  echo "Running \"$cmd\"";
  eval "${cmd} &"
  pid=$!
  pids+=" $pid";
}; done

trap "kill $pids" SIGINT

wait $pids
```

This scripts starts all commands in the background and grab their PIDs. Once it catches interrupt signal (usually `ctrl + c`), it kills all commands through collected PIDs.

Since scripts running in the background use `STDOUT` correctly, there is no need for extra work to capture the output.
