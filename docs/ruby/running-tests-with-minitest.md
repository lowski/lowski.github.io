---
layout: default
title: Running tests with Minitest
date: 2020-05-31
parent: Ruby
---

# Running tests with Minitest

There are a few ways to run specific files or tests with [Minitest](https://rubygems.org/gems/minitest/){:target="_blank"}:

**Run a single test file:**

```bash
rake test TEST=test/features/test_site.rb
```

**Run a single test:**

```bash
rake test TEST=test/features/test_site.rb TESTOPTS="--name=test_foobar -v"
```

**Run tests from a single directory:**

```bash
rake test TEST=test/features/foobar/*.rb
```

**Run tests from a single directory and its sub-subdirectories:**

```bash
rake test TEST=test/features/**/*.rb
```
