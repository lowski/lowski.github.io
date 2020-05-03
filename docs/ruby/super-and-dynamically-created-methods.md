---
layout: default
title: Super and dynamically created methods in Ruby
date: 2020-05-03
parent: Ruby
---

# Super and dynamically created methods in Ruby

Calling `super` from overridden methods that have been created with `define_method` is not always easy. It depends on how the original method has been defined.

Let's take a look at exemplary `Sanitizer` module:

```ruby
module Sanitizer
  def attribute(name)
    define_method("#{name}=") do |val|
      instance_variable_set("@#{name}", val.downcase.gsub(/\s+/, '-'))
    end

    attr_reader(name)
  end
end
```

It can be consumed in a custom class:

```ruby
class Article
  extend Sanitizer

  attribute :link
end
```

This works fine until there is a need to override a setter (i.e. to add additional logic):

```ruby
class Article
  extend Sanitizer

  attribute :link

  def link=(val)
    super(val[0..40])
  end
end
```

It simply doesn't work because `Sanitizer` module relies on meta-programming - setter is added directly to `Article` class and gets overridden when `link=` method is re-defined.

To make original methods overrideable, they need to be defined on the anonymous module which gets included in consuming class:

```ruby
module Sanitizer
  def sanitizer
    @sanitizer ||= Module.new.tap { |m| include(m) }
  end

  def attribute(name)
    sanitizer.send(:define_method, "#{name}=") do |val|
      instance_variable_set("@#{name}", val.downcase.gsub(/\s+/, '-'))
    end

    sanitizer.send(:attr_reader, name)
  end
end
```

```
article = Article.new
article.link = "new link"
article.link
#=> "new-link"

Article.ancestors
#=> [Article, #<Module:0x00007f82af192ec0>, Object, Kernel, BasicObject]
```

**What if `Sanitizer` module can't be modified for some reason (i.e. because it comes from 3rd party gem)?**

Create anonymous module with overridden method and prepend it to the class:

```ruby
class Article
  extend Sanitizer
  attribute :link

  prepend(Module.new do
    def link=(val)
      super(val[0..40])
    end
  end)
end
```

```
article = Article.new
article.link = "new link"
article.link
#=> "new-link"

Article.ancestors
#=> [#<Module:0x00007fab69083128>, Article, Object, Kernel, BasicObject]
```
