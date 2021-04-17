---
layout: default
title: Overriding model name in Rails
date: 2019-04-30
parent: Ruby
---

# Overriding model name in Rails

Rails automatically generates URLs for `redirect_to`, `form_for` methods based on the provided object (via [ActionDispatch::Routing::UrlFor#url_for](https://api.rubyonrails.org/v3.2.14/classes/ActionDispatch/Routing/UrlFor.html#method-i-url_for){:target="_blank"}). Sometimes, there are situations when we want to customize that (i.e. object is namespaced).

Let's look at simple `Identity::Session` object:

```ruby
module Identity
  class Session
    ...
  end
end
```

Passing `Identity::Session` instance to `form_for` helper will use `session_identities_path` method as an `action` attribute.

This can be changed by overriding `Identity::Session.model_name` method with some help from [ActiveModel::Name](https://api.rubyonrails.org/classes/ActiveModel/Name.html){:target="_blank"}.

`ActiveModel::Name` can automatically detect `namespace` and `name` based on the provided `klass`:

```
naming = ActiveModel::Name.new(Identity::Session)
naming.name
#> "Identity::Session"
naming.route_key
#> "session_identities"
```

It also accepts `klass`, `namespace` and `name` as separate arguments to override its default behavior:

```
naming = ActiveModel::Name.new(Identity::Session, nil, "Session")
naming.name
#> "Session"
naming.route_key
#> "sessions"
```

They can be even used to change the namespace:

```
naming = ActiveModel::Name.new(Identity::Session, Identity, "Logins::Session")
naming.name
#> "Logins::Sessions" 
naming.route_key
#> "logins_sessions"
```

Now we just need to use it to override `Identity::Session.model_name` method, according to our needs:

```ruby
module Identity
  class Session
    def self.model_name
      ActiveModel::Name.new(self, nil, "Session")
    end
  end
end
```

After that, `Identity::Session` instance can be passed to `form_for` or `redirect_to` methods.

URLs can be verified with `ActionDispatch::Routing::UrlFor#url_for` method in the `rails console`:

```ruby
include ActionDispatch::Routing::UrlFor
include Rails.application.routes.url_helpers
Rails.application.routes.default_url_options = { host: 'localhost:3000' }
url_for(session)
#> "http://localhost:3000/sessions"
```

Thank you [@amatchneer](https://twitter.com/amatchneer){:target="_blank"} for spotting typos!
