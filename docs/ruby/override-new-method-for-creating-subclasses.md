---
layout: default
title: Override new method for creating subclasses in Ruby
date: 2020-10-11
parent: Ruby
---

# Override new method for creating subclasses in Ruby

*Keep in mind this is more of a meta-programming exercise rather tip for a production-ready code*

This is an example how you might use built-in `Class#new` method for a factory-like behavior:

```ruby
class Kid
  class << self
    alias new_org new

    def new(type, *args)
      case type
      when :boy
        Boy.new_org(*args)
      when :girl
        Girl.new_org(*args)
      else
        raise(ArgumentError, "Type #{type} not recognized")
      end
    end
  end
end

class Boy < Kid
  def welcome
    "Welcome Baby Boy"
  end
end

class Girl < Kid
  def welcome
    "Welcome Baby Girl"
  end
end
```

Then it can be used as follows:

```
girl = Kid.new(:girl)
girl.welcome
=> "Welcome Baby Girl"
```

```
boy = Kid.new(:boy)
boy.welcome
=> "Welcome Baby Boy"
```

```
kid = Kid.new(:kid)
=> ArgumentError (Type kid not recognized)
```
