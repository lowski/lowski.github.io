---
layout: default
title: Enumerable#tally in Ruby 2.7
date: 2020-02-23
parent: Ruby
---

# Enumerable#tally in Ruby 2.7

Ruby 2.7 adds `Enumerable#tally` method for counting the same items in a collection. Before that i.e.  `Enumerable#each_with_object` had to be used:

```ruby
elements = [1, 2, 3, 4, 1, 2, 4, 2, 3]
elements.each_with_object(Hash.new(0)) { |e, h| h[e] += 1 }
```

```
=> {1=>2, 2=>3, 3=>2, 4=>2}
```

With a new `tally` method, it's much easier:

```ruby
elements.tally
```

```
=> {1=>2, 2=>3, 3=>2, 4=>2}
```
