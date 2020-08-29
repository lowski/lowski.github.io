---
layout: default
title: New methods introduced in Ruby 2.7
date: 2020-08-16
parent: Ruby
---

# New methods introduced in Ruby 2.7

Ruby 2.7 introduced some helpful methods:

## Enumerable#tally

`Enumerable#tally` allows to count the same elements in the array:

```ruby
%i[foo bar foo bar bar baz].tally
=> {:foo=>2, :bar=>3, :baz=>1}
```

[Enumerable#tally_by](https://bugs.ruby-lang.org/issues/11076){:target="_blank"} is still under consideration.

## Enumerable#filter_map

`Enumerator#filter_map` simply combines filter and map in a single function:

```ruby
(1..8).filter_map { |n| n ** 2 if n.even? }
=> [4, 16, 36, 64]
```

## Enumerator#produce

`Enumerator#produce` generates an enumerator where next element is calculated by block where previous element is passed as an argument.

```ruby
sequence = Enumerator.produce(1) { |n| n * 2 }
sequence.take(3)
=> [1, 2, 4]
```

## Array#intersection

`Array#intersection` is more of an alias (to `Array#&`) rather than a new functionality:

```ruby
%i[foo bar].intersection(%i[foo])
=> [:foo]
```

## Numbered parameters for blocks

Not a method but cool feature allowing to access to block arguments based on their position:

```ruby
%i[foo bar].map { _1 }
=> [:foo, :bar]
%i[foo bar].each_with_index.map { "#{_1}=#{_2}" }
=> ["foo=0", "bar=1"]
```
