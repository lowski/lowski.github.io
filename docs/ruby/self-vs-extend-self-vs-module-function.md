---
layout: default
title: self vs extend self vs module_function
date: 2018-07-30
parent: Ruby
---

# Self vs extend self vs module_function

In Ruby there are at least 3 ways to expose a function so it can be called directly on the module:

- define a method with `self` prefix
- define a method and use `extend self`
- define a method and use `module_function`

## self

```ruby
module A
  def self.foo
    puts "I'am A.foo"
  end
end

A.foo
#=> I'am A.foo
```

When you define a method with `self` prefix, it becomes defined on the module's [eigenclass](https://medium.com/@ethan.reid.roberts/rubys-anonymous-eigenclass-putting-the-ei-in-team-ebc1e8f8d668) - a unique class associated with every Ruby object where you to define a new methods.

Check A's `eigenclass` methods and its ancestors:

```ruby
class << A
  p self.public_instance_methods
  p self.ancestors
end
#=> [:foo, :<=>, :include, :<=, :>=, :==, :===, ... ]
#=> [#<Class:A>, Module, Object, Kernel, BasicObject]
```

A public method `foo` is defined on the A's `eigenclass`.

## module_function

[module_function](https://ruby-doc.org/core-2.5.0/Module.html#method-i-module_function) allows to expose instance's methods so they can be called as they would be class methods.

```ruby
module B
  def foo
    puts "I'm B.foo"
  end

  module_function :foo
end

B.foo
#=> I'am B.foo
```

B's `eigenclass` is the same as in previous example:

```ruby
class << B
  p self.public_instance_methods
  p self.ancestors
end
#=> [:foo, :<=>, :include, :<=, :>=, :==, :===, ... ]
#=> [#<Class:B>, Module, Object, Kernel, BasicObject]
```

There is a small difference though. `module_function` actually copies the method, so overriding the original one, won't propagate unless `module_function` is called once again:

```ruby
module B
  def foo
    puts "I'm overriden B.foo"
  end
end

B.foo
#=> I'am B.foo

module B
  module_function :foo
end

B.foo
#=> I'm overriden B.foo
```

## extend self

`extend self` basically extends the module with functions defined in it:

```ruby
module C
  extend self

  def foo
    puts "I'am C.foo"
  end
end

C.foo
#=> I'am C.foo
#=> nil
```

In opposite to `module_function`, overridden methods stay in sync:

```ruby
module C
  def foo
    puts "I'am new C.foo"
  end
end

C.foo
#=> I'am new C.foo
```

The C's eigenclass looks almost the same as previous ones:

```ruby
class << C
  p self.public_instance_methods
  p self.ancestors
end
#=> [:foo, :<=>, :include, :<=, :>=, :==, :===, ... ]
#=> [#<Class:C>, C, Module, Object, Kernel, BasicObject]
```

Except that `C` module also exists in the C's `eigenclass` ancestors, which in some cases might be useful.

Consider an example where overridden method should allow to call parent one. Because methods exposed through `self` or `module_function` are actually defined on the `eigenclass`,  `super` is not available:

```ruby
module A
  def self.foo
    puts "I'm a new A.foo"
    super
  end
end

A.foo
#=> I'm a new A.foo
#=> NoMethodError: super: no superclass method `foo' for A:Module
#=> Did you mean?  fork
```

```ruby
module B
  def self.foo
    puts "I'm a new B.foo"
    super
  end
end

B.foo
#=> I'm a new B.foo
#=> NoMethodError: super: no superclass method `foo' for B:Module
#=> Did you mean?  fork
```

It works with `extend self` though:

```ruby
module C
  def self.foo
    puts "I'm a new C.foo"
    super
  end
end

C.foo
#=> I'm a new C.foo
#=> I'am C.foo
```

Since `C` is also an ancestor of C's `eigenclass`,`super` is accessible in overridden method.

## Alternative solution

It's actually possible to override `A.foo` and `B.foo` methods but it requires using [Module#prepend](https://ruby-doc.org/core-2.5.0/Module.html#method-i-prepend) to place a module in front of A's and B's `eigenclass`:

```ruby
module A
  class << self
    prepend(Module.new do
      def foo
        puts "I'm a new A.foo"
        super
      end
    end)
  end
end

A.foo
#=> I'm a new A.foo
#=> I'am A.foo

class << A
  p self.ancestors
end
#=> [#<Module:0x007fd8e0052628>, #<Class:A>, Module, Object, Kernel, BasicObject]
```

```ruby
module B
  class << self
    prepend(Module.new do
      def foo
        puts "I'm a new B.foo"
        super
      end
    end)
  end
end

B.foo
#=> I'm a new B.foo
#=> I'm B.foo

class << B
  p self.ancestors
end
#=> [#<Module:0x007feb7c90f4b0>, #<Class:B>, Module, Object, Kernel, BasicObject]
```
