---
layout: default
title: Authentication for private Ruby gems
date: 2020-06-08
parent: Ruby
---

# Authentication for private Ruby gems

Assuming your gem's repository is hosted on `git.acme.com` and it's included in the Gemfile like:

```ruby
gem 'my-custom-gem', git: 'https://git.acme.com/my-custom-gem.git'
```

Bundler can be configured to authenticate via:

```
bundle config --local git.acme.com username:password
```

or ENV variable might be used (useful for Heroku, Dokku alike hostings and CI/CI):

```
BUNDLE_GIT__ACME__COM: username:password
```
