---
layout: default
title: Using OR operator with Hanami repositories
date: 2019-03-23
parent: Ruby
---

# Using OR operator with Hanami repositories

Hanami repositories allow to filter records by providing conditions as:

1. `hash`:

    ```ruby
    users.where(first_name: "Bart", last_name: "Simpson")
    ```

2. `block`:

    ```ruby
    users.where { first_name.is("Bart") | last_name.is("Simpson") }
    ```

3. Both of them

The first option will combine conditions using `AND` operator. In this example, it will retrieve users whose first name is `Bart` and last name is `Simpson`. Second one allows for more advance queries. Here, it will fetch users whose first name is `Bart` or last name is `Simpson`.

Unfortunately it's not clear how to combine sets of conditions with `OR` operator (i.e. array of hashes where record has to match at least one set):

```ruby
# Find all Bart Simpsons or Homers
users.where([
  { first_name: "Bart", last_name: "Simpson" },
  { first_name: "Homer" }
])
```

Such operation might be useful if you would like to dynamically provide multiple conditions to build queries.

Since Hanami uses [rom-rb](https://rom-rb.org/) and [Sequel](http://sequel.jeremyevans.net/) under the hood, [Sequel::SQL::BooleanExpression](http://sequel.jeremyevans.net/rdoc/classes/Sequel/SQL/BooleanExpression.html) might be leveraged to create  flexible clauses:

```ruby
class UsersRepository < Hanami::Repository
  def all_matching(filters)
    clause = Sequel.|(*filters)
    users.where(clause).to_a
  end
end
```

`Sequel.|` accepts multiple conditions (each set represented as a hash) and combine them using `OR` operator as `BooleanExpression` which is supported by `where` method.