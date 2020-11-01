---
layout: default
title: Using auto-loaded constants in Rails initializers
date: 2020-11-01
parent: Ruby
---

# Using auto-loaded constants in Rails initializers

When application gets upgraded to Rails 6.x, it might show a deprecation warning: **Initialization autoloaded the constant Example.**

Description of this warning should be clear enough to understand it:

> Being able to do this is deprecated. Autoloading during initialization is going to be an error condition in future versions of Rails.

> Reloading does not reboot the application, and therefore code executed during initialization does not run again. So, if you reload Example, for example, the expected changes won't be reflected in that stale Class object.

> This autoloaded constant has been unloaded.

> Please, check the "Autoloading and Reloading Constants" guide for solutions.

As for now, there are two ways to use auto-loaded constants in initializers to preserve code reloading (and be compatible with Rails >= 6.x):

- `Rails.application.config.to_prepare`
- `Rails.application.reloader.to_prepare`

`config.to_prepare` actually uses `reloader.to_prepare` under the hood: inside the `Application::Finisher` module, there is a [dedicated initializer](https://github.com/rails/rails/blob/v6.0.3.4/railties/lib/rails/application/finisher.rb#L104){:target="_blank"} to copy `config.to_prepare` callbacks into `reloader.to_prepare`.

[Initialization events section of Rails Guides](https://guides.rubyonrails.org/configuring.html#initialization-events){:target="_blank"} mentions that `to_prepare` block is executed on every request during development but it's not accurate any more.
