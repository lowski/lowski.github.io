---
layout: default
title: Reusing Rails scopes in the OR operator
date: 2021-02-07
parent: Ruby
---

# Reusing Rails scopes in the OR operator

[Ruby on Rails](https://rubyonrails.org/){:target="_blank"} allows to use `OR` operator while building [ActiveRecord](https://guides.rubyonrails.org/active_record_basics.html){:target="_blank"} queries:

```ruby
User.where(id: 1).or(User.where(status: 'active'))
```

Since `OR` operator requires both relations to be structurally compatibly, it might get tedious with multiple conditionals and joins:

```ruby
User
  .joins(:account)
  .where(accounts: { status: 'active' })
  .or(User.joins(:account).where.not(name: nil))
```

(even though `accounts` association is not used in the `or` condition, it needs to be included to remain structural compatibility)

[ActiveRecord::Relation#scoping](https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-scoping){:target="_blank"} can help with scoping all queries in within the block:

```ruby
User.joins(:account).scoping do
  User.where(accounts: { status: 'active' }).or(User.where.not(name: nil))
end
```

If above code is within `User` model, it can even gets simpler:

```ruby
joins(:account).scoping do
  where(accounts: { status: 'active' }).or(where.not(name: nil))
end
```
