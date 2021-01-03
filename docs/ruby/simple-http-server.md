---
layout: default
title: Simple HTTP server with Ruby
date: 2021-01-02
parent: Ruby
---

# Simple HTTP server with Ruby

Ruby standard library provides a simple HTTP server called [WEBrick](https://ruby-doc.org/stdlib-2.7.0/libdoc/webrick/rdoc/index.html){:target="_blank"}. It can be used to serve static files from a directory with one-line script:

```
ruby -run -e httpd
```

Where:

- `-run` stands for `require 'un'` ([un](https://github.com/ruby/ruby/blob/master/lib/un.rb){:target="_blank"} is a small utility library for common UNIX commands)
- `-e httpd` means execute [httpd](https://github.com/ruby/ruby/blob/master/lib/un.rb#L323){:target="_blank"} method from the `un` library

The `httpd` will start `WEBrick` server to simply serve files from a current directory.
