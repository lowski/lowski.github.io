---
layout: default
title: Installing mysql2 gem without MySQL on MacOS
date: 2020-05-10
parent: Ruby
---

# Installing mysql2 gem without MySQL on MacOS

Install `mysql-connector` first using [Homebrew](https://brew.sh){:target="_blank"}:

```
brew install mysql-connector-c
```

Then modify its config so it understands `-l-lpthread` option:

1. Open `/usr/local/Cellar/mysql-connector-c/version/bin/mysql_config`
2. Change `libs="$libs -l "` to `libs="libs -l mysqlclient "`
