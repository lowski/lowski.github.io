---
layout: default
title: Email previews with Rails
date: 2021-01-31
parent: Ruby
---

# Email previews with Rails

Ruby on Rails has built-in mechanism for [previewing emails](https://guides.rubyonrails.org/action_mailer_basics.html#previewing-emails){:target="_blank"} (HTML and text variants) in the browser. The list of all available previews is available at [http://app.localhost:3000/rails/mailers/](http://app.localhost:3000/rails/mailers/){:target="_blank"} (server must be running).

*It will display a blank page if there are no previews yet.*

To implement an email preview, create a new file (e.g. `user_mailer_preview.rb`) in `/test/mailers/preview` (for MiniTest) or `/spec/mailers/previews/` directory (for RSpec):

```ruby
# /spec/mailers/previews/user_mailer_preview.rb (for MiniTest)
# /spec/mailers/previews/user_mailer_preview.rb (for RSpec)

class UserMailerPreview < ActionMailer::Preview
  def welcome_email
    UserMailer.with(user: User.first).welcome_email
  end
end
```

Now `/rails/mailers/` should show:

```
UserMailer

  * welcome_email
```

Once `welcome_email` is clicked, it will render the preview of the welcome email for the first User (variant can be changed via `Format` dropdown).

Keep in mind that previewing feature requires a data to generate, and does not intercept email delivery flow. If email should be previewed instead of sent (e.g. during development), [letter_opener_web](https://github.com/fgrehm/letter_opener_web){:target="_blank"} is one of the solutions.
