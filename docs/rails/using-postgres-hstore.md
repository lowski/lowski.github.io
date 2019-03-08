---
layout: default
title: Using PostgreSQL hstore with Ruby on Rails
date: 2018-12-20
parent: Ruby on Rails

---

# Using PostgreSQL hstore with Ruby on Rails

Ruby on Rails supports `hstore` from PostgreSQL out of the box. To use it, you need to enable `hstore` extension (if it hasn't been enabled yet) and add a new column to the table:

```ruby
class AddPreferencesToUsers < ActiveRecord::Migration
  def change
    enable_extension 'hstore'
    add_column :users, :preferences, :hstore
    add_index :users, :preferences, using: :gin
  end
end
```

After running the migration you need to define a serializer for serializing / deserializing model's attributes (can be a separate class i.e. backed by `Virtus.model`):

```ruby
class UserPreferences
  include Virtus.model

  attribute :github, String
  attribute :twitter, String
  attribute :newsletter, Boolean

  def self.dump(preferences)
    preferences.to_hash
  end

  def self.load(preferences)
    new(preferences)
  end
end
```

Now you need to let Rails know to use your serializer for the column in the model:

```ruby
class User < ActiveRecord::Base
  serialize :preferences, UserPreferences
end
```

