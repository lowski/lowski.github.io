---
layout: default
title: Accessing database configuration with Rails
date: 2020-08-23
parent: Ruby
---

# Accessing database configuration with Rails

Database configuration can be access via `Rails.configuration` object:

```ruby
Rails.configuration.database_configuration[Rails.env]
#> {"adapter"=>"sqlite3", "pool"=>5, "timeout"=>5000, "database"=>"db/development.sqlite3"}
```

`Rails.env` can be replaced with any of the available environments, i.e.:

```ruby
Rails.configuration.database_configuration["development"]
#> {"adapter"=>"sqlite3", "pool"=>5, "timeout"=>5000, "database"=>"db/development.sqlite3"}
```
