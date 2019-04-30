---
layout: default
title: Overriding model name in Rails
date: 2019-04-30
parent: Ruby
---

# Overriding model name in Rails

Rails automatically generates url paths for `redirect_to`, `form_for` methods based on the provided object. Sometimes there are situations when you don't want that - i.e. object is namespaced or extended.

Let's look at simple `Identity::Session` object:

```ruby
module Identity
  class Session
    ...
  end
end
```

Passing `Identity::Session` instance to `form_for` helper will result in `session_identities_path` call to generate path for `action` attribute.

This can be changed by overriding `Identity::Session.model_name` method with little help from [ActiveModel::Name](https://api.rubyonrails.org/classes/ActiveModel/Name.html).  `ActiveModel::Name` is able to automatically detect `namespace` and `name` based on the provided `klass`:

```
naming = ActiveModel::Name(Identity::Session)
naming.name
#> "Identity::Session"

naming.route_key
#> session_identities_path
```

It also accepts `klass`, `namespace` and `name` as separate arguments:

```
naming = ActiveModel::Name(Identity::Session, nil, "Session")
naming.name
#> "Session"

naming.route_key
#> sessions_path
```

Now the last remaining part is to override `.model_name` method:

```ruby
module Identity
  class Session
    self.model_name
      ActiveModel::Name(self, nil, "Session"
    end
  end
end
```

After that `Identity::Session` instance can be safely passed to `form_for` or `redirect_to` methods.
