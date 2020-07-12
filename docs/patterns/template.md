---
layout: default
title: Template pattern
date: 2020-07-12
parent: Design patterns
---

# Template pattern

A template is base class that implements shared behavior via helper methods which can be overridden in extending classes. Such base class may provide default behavior by implementing those helpers itself or require extending classes to do it.

The main challenge in applying the template pattern is determining which part of shared behavior is likely to change. Separating each part of the main logic into helper methods might be a good idea but it also may lead to tangled and unreadable code. The alternative is to start small and apply additional refactoring when it's actually needed.

## Example

```ruby
module Drinkable
  def prepare
    ingredients.join(',')
  end

  def shake
    ingredients.shuffle!
  end

  def ingredients
    raise NoMethodError, "The Drinkable module requires extending class to define a 'ingredients' method"
  end
end

class Coffee
  include Drinkable

  def ingredients
    ["Coffee", "Milk", "Sugar"]
  end
end
```
