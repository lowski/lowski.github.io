---
layout: default
title: Deprecating methods with ActiveSupport
date: 2020-09-13
parent: Ruby
---

# Deprecating methods with ActiveSupport

When working with the code there are situations, where some methods are planned for phase-out (especially while working on some publicly available library). In those cases, `ActiveSupport#deprecate` method might come handy:

```ruby
class User
  def full_name
    "#{first_name} #{last_name}"
  end

  def name
    full_name
  end

  deprecate :name
end
```

Now when `User.name` is called, a deprecation warning will be shown:

```
irb(main):011:0> user.name
DEPRECATION WARNING: name is deprecated and will be removed from Rails 6.2 (called from irb_binding at (irb):11)
=> "Jon Snow"
```

`ActiveSupport#deprecate` allows to specify a new method's name that should be used instead:

```ruby
class User
  ...

  deprecate name: :full_name
end
```

Now when calling `User.name`, a nice hint will be provided:

```
irb(main):014:0> user.name
DEPRECATION WARNING: name is deprecated and will be removed from Rails 6.2 (use full_name instead) (called from irb_binding at (irb):14)
=> "Jon Snow"
```

It's also possible to provide a custom hint:

```ruby
class User
  ...

  deprecate name: 'try User#full_name instead'
end
```

Which will be used instead of default `use {new_method} instead`:

```
irb(main):017:0> user.name
DEPRECATION WARNING: name is deprecated and will be removed from Rails 6.2 (try User#full_name instead) (called from irb_binding at (irb):17)
=> "Jon Snow"
```

Release name and its version can be adjusted (via custom deprecator) as well:

```ruby
class User
  ...

  next_release_deprecator = ActiveSupport::Deprecation.new('next-release', 'MyGem')
  deprecate name: 'try User#full_name instead', deprecator: next_release_deprecator

  # or use deprecator directly
  # next_release_deprecator.deprecate_methods(self, name: :full_name)
end
```

Which gives:

```
irb(main):020:0> user.name
DEPRECATION WARNING: name is deprecated and will be removed from MyGem next-release (try User#full_name instead) (called from irb_binding at (irb):24)
=> "Jon Snow"
```
