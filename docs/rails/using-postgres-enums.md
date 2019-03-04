---
layout: default
title: Using PostgreSQL enums with Ruby on Rails
date: 2018-12-24
parent: Ruby on Rails
---

# Using PostgreSQL enums with Ruby on Rails

[Ruby on Rails](https://rubyonrails.org) supports enums but it uses integers for representing different enum values. It also does not enforce those numbers on the database level.

Those problems can be easily solved by Postgres enums.

A new enum type in the database needs to be created (via migration) before it can actually be used.

```ruby
 def up
   ActiveRecord::Base.connection.execute <<~SQL
     CREATE TYPE color AS ENUM ('red', 'green', 'blue');
   SQL

   add_column :traffic_lights, :color, :color, index: true
 end

 def down
   remove_column :traffic_lights, :color

   ActiveRecord::Base.connection.execute <<~SQL
     DROP TYPE color;
   SQL
 end
```

After running the migration, Rails should be able to use native database `enum` in the model:

```ruby
class TrafficLight < ApplicationRecord
  enum color: {
    red: 'red',
    green: 'green',
    blue: 'blue',
  }
end
```

It's compatible with Rails enums so all helper methods like `red?`, `green?`, `blue?`, `colors`, etc. are supported.
