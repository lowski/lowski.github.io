---
layout: default
title: Array.wrap vs Kernel#array
date: 2019-08-03
parent: Ruby
---

# Array.wrap vs Kernel#Array

Both methods allow to convert an argument into an array but `Kernel#Array` has additional behavior:

- It tries to call `to_ary` and then `to_a` on the argument (`Array.wrap` immediately returns first element as single array item if object does not respond to `to_ary` method)
- If `to_ary` does not return `nil` or `Array`, it raises an exception

`Array#wrap` from `ActiveSupport` gem might be a better option for objects with custom `to_a` implementation such as `LibXML::XML::Node#to_a` (returns an array with a copy of the original node):

```ruby
require 'libxml'
xml_node = LibXML::XML::Node.new('title', 'My title') # <LibXML::XML::Node:0x00007f98170995c8>
Array.wrap(xml_node) # [#<LibXML::XML::Node:0x00007f980b3e35f0>]
Array(xml_node) # [#<LibXML::XML::Node:0x00007f98170995c8>]

Array.wrap(xml_node).first.equal? Array.wrap(xml_node).first # true
Array(xml_node).first.equal? Array(xml_node).first # false
```

Id in `Kernel#Array` result is different than `xml_node` object's id.

## to_ary vs to_a

There is also a small difference between `to_ary` and `to_a` methods. The former one is used for treating object as an array (i.e. for implicit conversion) while latter one performs actual conversion.

```ruby
Point = Struct.new(:x, :y) do
  def to_ary
    [x, y]
  end
end

p = Point.new(1, 2)
x, y = p

x # 1
y # 2
```
