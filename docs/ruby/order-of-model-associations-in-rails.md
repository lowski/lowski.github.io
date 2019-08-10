---
layout: default
title: Order of model associations in Rails
date: 2019-08-10
parent: Ruby
---

# Order of model associations in Rails

Rails 5.1 raises `HasManyThroughOrderError` error if association using `through: :other_association` is defined before source association (`other_association` in this case).

Before Rails 5.1:

```ruby
class User < ApplicationRecord
  has_many :groups, through: :memberships
  has_many :memberships, dependent: :destroy
end
```

From Rails 5.1:

```ruby
class User < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :groups, through: :memberships
end
```

Link to [original issue on Github](https://github.com/rails/rails/issues/29123).
