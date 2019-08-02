---
layout: default
title: Redirect back with Rails
date: 2019-08-02
parent: Ruby
---

# Redirect back with Rails

Rails has built-in mechanism for redirecting user to the page that issued the request. It simply relies on `HTTP_REFERER` header.

In Rails 5 the mechanism was changed from simple `redirect_to :back` to dedicated function: `redirect_back(fallback_location:, allow_other_host: true, **args)`.

- `fallback_location` required to deal with situation when `HTTP_REFERER` is not present (required)
- `allow_other_host` to allow / disallow to different host than the current one (default `true`)

```ruby
redirect_back(fallback_location: root_path)
redirect_back(fallback_location: @post)
redirect_back fallback_location: proc { edit_post_url(@post) }
redirect_back fallback_location: '/', allow_other_host: false
```

[https://api.rubyonrails.org/classes/ActionController/Redirecting.html#method-i-redirect_back](https://api.rubyonrails.org/classes/ActionController/Redirecting.html#method-i-redirect_back)
