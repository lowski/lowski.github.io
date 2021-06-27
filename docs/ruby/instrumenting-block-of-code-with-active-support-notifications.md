---
layout: default
title: Instrumenting block of code with ActiveSupport::Notifications
date: 2021-06-27
parent: Ruby
---

# Instrumenting block of code with ActiveSupport::Notifications

`ActiveSupport::Notifications` is an instrumentation toolkit for Ruby that is  used by the Ruby on Rails framework internally. It was generally designed for listening to events during the entire life of the application but also provides two escape hatches to temporally instrument block of codes:

Providing `callback` (lambda / proc) to `subscribed` method:

```ruby
callback = lambda {|name, started, finished, unique_id, payload| ... }
ActiveSupport::Notifications.subscribed(callback, event) do
  ...
end
```

Manually unsubscribing from the events:

```ruby
subscriber = ActiveSupport::Notifications.subscribed(event) do |name, started, finished, unique_id, payload|
  ...
end

ActiveSupport::Notifications.unsubscribe(subscriber)
```

With that knowledge we can build a small debugging tool to inspect events during a block of code (i.e. requests made by [excon](https://github.com/excon/excon) gem):

```ruby
def instrument(&block)
  requests = []
  subscriber = ActiveSupport::Notifications.subscribe('excon.request') do |_, _start, _end, _unique_id, payload|
    requests << payload
  end

  block.call

  requests
ensure
  ActiveSupport::Notifications.unsubscribe(subscriber)
end

requests = instrument(my_method_making_api_requests)
```

However, if you run this code on a multi-threaded server like Puma, you will run into a bug where events from requests in `my_method_making_api_requests` are captured from other threads as well. To fix it, we first need to understand how `ActiveSupport::Notifications` notifies listeners about the event.

Whenever we call `ActiveSupport::Notifications.instrument` method, it selects [instrumenter](https://github.com/rails/rails/blob/83217025a171593547d1268651b446d3533e2019/activesupport/lib/active_support/notifications.rb#L253){:target="_blank"} from [InstrumentationRegistry](https://github.com/rails/rails/blob/83217025a171593547d1268651b446d3533e2019/activesupport/lib/active_support/notifications.rb#L266){:target="_blank"} via `InstrumentationRegistry.instance.instrumenter_for(notifier)` for current `notifier` strategy (by default it uses `fanout` queue, which just pushes events to all registers subscribers).

`InstrumenterRegistry` extends `ActiveSupport::PerThreadRegistry` module so for each thread, it returns a separate instance whenever we call `.instance`. Each thread's instance has a different `Instrumenter` class identifier by unique id (`unique_id` argument passed to subscribe block or callback). To get the current thread instrument's id we need to call `ActiveSupport::Notifications.instrumenter.id`.

So basically to instrument events from the current thread, we need to its instrumenter's id, and ignore events made by all other threads:

```ruby
def instrument(&block)
  current_thread_instrumenter_id = ActiveSupport::Notifications.instrumenter.id

  requests = []
  subscriber = ActiveSupport::Notifications.subscribe('excon.request') do |_, _start, _end, instrumenter_id, payload|
    # Collect payloads for current thread only
    requests << payload if instrumenter_id == current_thread_instrumenter_id
  end

  block.call

  requests
ensure
  ActiveSupport::Notifications.unsubscribe(subscriber)
end
```
