---
layout: default
title: Turning string into predicate in Ruby
date: 2020-11-15
parent: Ruby
---

# Turning string into predicate in Ruby

[ActiveSupport::StringInquirer](https://apidock.com/rails/v6.0.0/ActiveSupport/StringInquirer){:target="_blank"} provides a nice way to test strings for equality via predicate methods:

```ruby
env = ActiveSupport::StringInquirer.new('production')
env.production?
#> true
env.development?
#> false
```

Rails [extends String class](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/string/inquiry.rb){:target="_blank"} with [String#inquiry](https://apidock.com/rails/String/inquiry){:target="_blank"} to convert any string into `ActiveSupport::StringInquirer` object:

```ruby
env = 'production'.inquiry
env.production?
#> true
env.class
#> ActiveSupport::StringInquirer
```

Another nice thing about `ActiveSupport::StringInquirer` is that, it can be used in places where regular `String` is used for comparisons with other `String` values:

```ruby
env = 'production'.inquiry
env == 'production'
#> true
env == 'development'
#> false
```
