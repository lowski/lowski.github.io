---
layout: default
title: Nested transactions with Rails
date: 2020-11-29
parent: Ruby
---

# Nested transactions with Rails

In Ruby on Rails, nested transactions are owned by the most outer transaction. It means that raising `ActiveRecord::Rollback` error in the code below, will not prevent it from creating 2 users in the database: 

```ruby
User.transaction do
  User.create(username: 'Kotori')
  User.transaction do
    User.create(username: 'Nemu')
    raise ActiveRecord::Rollback
  end
end
```

It happens because exceptions captured within second transaction blocks are not visible to the first transaction. To make a nested transaction to behave like you would normally expect, you need to pass `requires_new: true` parameter:

```ruby
User.transaction do
  User.create(username: 'Kotori')
  User.transaction(requires_new: true) do
    User.create(username: 'Nemu')
    raise ActiveRecord::Rollback
  end
end
```

`ActiveRecord` emulates nested transactions via [savepoints](https://www.postgresql.org/docs/current/sql-savepoint.html){:target="_blank"} (supported by MySQL and PostgreSQL). More info [here](https://api.rubyonrails.org/classes/ActiveRecord/Transactions/ClassMethods.html#module-ActiveRecord::Transactions::ClassMethods-label-Nested+transactions){:target="_blank"}.

## Savepoint vs nested transaction

On the first sight savepoint might look identical to a nested transaction, but there is a main difference between them: rolling back outer transaction will revert changes from all nested savepoints, meanwhile true nested transaction could still be committed.
