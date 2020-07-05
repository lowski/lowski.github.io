---
layout: default
title: Adding Bulma to Ember.js application
date: 2020-07-05
parent: Ember.js
---

# Adding Bulma to Ember.js application

[Bulma](https://bulma.io){:target="_blank"} is excellent CSS framework for building user interfaces. It's more customizable than [Bootstrap](http://getbootstrap.com/){:target="blank"} thanks to many [sass variables](https://sass-lang.com/documentation/variables){:target="blank"} at your disposal.

To add `Bulma` to an existing Ember application:

1. Install [ember-cli-sass](https://github.com/adopted-ember-addons/ember-cli-sass){:target="blank"}: `ember install ember-cli-sass`
2. Install [node-sass](https://github.com/sass/node-sass){:target="blank"}: `npm install -D node-sass`
3. Modify `ember-cli-build.js`:

    ```javascript
    const EmberApp = require('ember-cli/lib/broccoli/ember-app');
    const nodeSass = require('node-sass');

    module.exports = function(defaults) {
      let app = new EmberApp(defaults, {
        sassOptions: {
          implementation: nodeSass,
          includePaths: [
            'node_modules/bulma',
          ],
        }
      });

      return app.toTree();
    };
    ```
4. Add `app/styles/app.scss` with following content:

    ```scss
    @import 'bulma';
    ```

5. Remove `app/styles/app.css`

If you need to customize `bulma` theme, define specific variables above `@import 'bulma';`.
