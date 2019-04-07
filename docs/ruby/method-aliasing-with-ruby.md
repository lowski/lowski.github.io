---
layout: default
title: Method aliasing with Ruby
date: 2019-04-07
parent: Ruby
---

# Method aliasing with Ruby

Ruby's provides two ways for aliasing methods:

- `alias` keyword (`alias new_method old_method`)
- `alias_method` method from `Module` object (`alias_method :new_method, :old_method`)

Both of them works in a similar way: they create a copy of aliased method under a new name. If you modify the original method, the aliased version stays intact. There are small differences between them though:

- `alias_method` allows for more flexibility, i.e.:

    ```ruby
    class Foo
      def bar
        "bar"
      end

      alias_method "#{name.downcase}_bar", :bar
    end

    p Foo.new.foo_bar
    ```

- `alias` can be used in any scope (class, method, etc.):

    ```ruby
    class Foo
      def bar
        "bar"
      end

      def enable_aliases
        alias :foo_bar :bar
      end
    end

    foo = Foo.new
    foo.enable_aliases
    foo.foo_bar
    ```

- `alias_method` depends on the value of `self` at run time so `enable_aliases` method from above would have to be modified as follows:

  ```ruby
  def enable_aliases
    self.class.send(:alias_method, :foo_bar, :bar)
  end
  ```

## alias_attribute based alternative

[ActiveSupport](https://github.com/rails/rails/tree/master/activesupport) adds [alias_attribute](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/module/aliasing.rb#L21) method to `Module` object.

`alias_attribute` works a little bit differently than 2 examples above:

- it actually defines 3 methods: `new_name`, `new_name?` and `new_name=`
- aliased methods do not accept arguments (except the setter which accepts only single argument - new value)
- it does not copy the original method - it just calls it instead
- similarly to `alias_method` it depends on the value of `self`

At first glance it does not look like a useful thing but it's actually pretty useful for methods defined via `method_missing` (i.e. attributes of Hanami entities):

```ruby
require "hanami/entity"
require "active_support/core_ext/module/aliasing"

class User < Hanami::Entity
  alias_attribute :first_name, :firstName
  alias_attribute :last_name, :lastName
end
```

For those aliases neither `alias` nor `alias_method` will work, as the interpreter will complain at run-time that `firstName` and `lastName` are not defined.
