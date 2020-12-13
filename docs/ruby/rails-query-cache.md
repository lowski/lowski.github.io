---
layout: default
title: Rails query cache
date: 2020-12-13
parent: Ruby
---

# Rails query cache

As per documentation:

> Query caching is a Rails feature that caches the result set returned by each query. If Rails encounters the same query again for that request, it will use the cached result set as opposed to running the query against the database again.

To check whether query caching is enabled you can run:

```
pry(main)> ActiveRecord::Base.connection.query_cache_enabled
=> false
```

Running the same query twice, will hit the database two times:

```
pry(main)> User.count
   (33.3ms)  SELECT COUNT(*) FROM "users"
=> 2
pry(main)> User.count
   (0.9ms)  SELECT COUNT(*) FROM "users"
=> 2
```

After enabling the query cache explicitly it will access database only once:

```
pry(main)> ActiveRecord::Base.connection.enable_query_cache!
=> true
pry(main)> User.count
   (0.7ms)  SELECT COUNT(*) FROM "users"
=> 2
pry(main)> User.count
  CACHE  (0.1ms)  SELECT COUNT(*) FROM "users"
=> 2
```

Rails automatically enables query cache on a request basis, so running the same query inside a single controller action results in using cache:

```ruby
class UsersController < ApplicationController
  def show
    users_count = User.count
    all_users_count = User.count
  end
end
```

```
Processing by UsersController#show as HTML
   (1.4ms)  SELECT COUNT(*) FROM "users"
  ↳ app/controllers/users_controller.rb:3:in `show'
  CACHE  (0.0ms)  SELECT COUNT(*) FROM "users"
```
