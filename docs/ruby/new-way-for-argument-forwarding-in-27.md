---
layout: default
title: New way for arguments forwarding in Ruby 2.7
date: 2020-09-20
parent: Ruby
---

# New way for arguments forwarding in Ruby 2.7

Ruby 2.7 introduced a shorthand syntax (`...`) for forwarding parameters to methods.

```ruby
def hello(...)
  p(...)
end

hello "world"
hello %i[foo bar]
```

```
=> "world"
=> [:foo, :bar]
```

## `...` vs `args` and `kwargs`

It might look similar to existing `args` and `kwargs` so let's compare them on an example:

```ruby
def greet(*args, **kwargs, &block)
  print "Args:"
  p args

  print "Kwargs:"
  p kwargs

  print "Block:"
  p block
end
```

```ruby
hello "world"
hello "world", at: 8
hello "world", at: 8 do
  "Good morning!"
end

greet "world"
greet "world", at: 8
greet "world", at: 8 do
  "Good morning!"
end
```

```
=>
"world"
=>
"world"
{:at=>8}
=>
"world"
{:at=>8}
=>
Args:["world"]
Kwargs:{}
Block:nil
=>
Args:["world"]
Kwargs:{:at=>8}
Block:nil
=>
Args:["world"]
Kwargs:{:at=>8}
Block:#<Proc:0x00007fdcadc1d0e0 (irb):56>
```

As shown above, `...` syntax is limited to simple forwarding arguments to a method at least until [leading arguments support from Ruby 3](https://github.com/ruby/ruby/pull/3190/files) gets backported.
