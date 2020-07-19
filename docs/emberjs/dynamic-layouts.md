---
layout: default
title: Dynamic layouts in Ember.js
date: 2020-07-19
parent: Ember.js
---

# Dynamic layouts in Ember.js

There are situations where the application's layout does not strictly follow routes structure (e.g. routes from the same nesting level would like to use a completely different layout). In such scenario, a layout can be implemented with glimmer components where the application's controller switches between them.

Let's imagine we would like to use two different layouts: `public` and `application`. We can implement those as following components (remember to replace `{{outlet}}` with `{{yield}}` in the template):

- `app/components/layout/public.hbs`
- `app/components/layout/application.hbs`

Then we need to add `layout` property to the `ApplicationController` class so we can switch between layouts from routes (`@tracked` decorator needed for reactivity):

```javascript
// app/controllers/application.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked layout = 'application';
}
```

We also need to add an initializer that will reopen `Route` class to select a current layout in the `setupController` hook based on route's `layout` property (it might fall-back to `application` if not defined):

```javascript
// app/initializers/layout.js
import Route from '@ember/routing/route';

export function initialize() {
  Route.reopen({
    setupController() {
      this._super(...arguments);

      const layout = this.layout || 'application';
      this.controllerFor('application').layout = layout;
    }
  });
}

export default {
  initialize
};
```

Now to change the layout, just provide `layout` in the route class, e.g.:

```javascript
import Route from '@ember/routing/route'

export default class HomeRoute extends Route {
  layout = 'public';
}
```
