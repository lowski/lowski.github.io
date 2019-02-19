---
layout: default
title: Using libraries from NPM
parent: Ember.js
---

# Using libraries from NPM

UPDATE: All those manual steps can be replaced with [ember-auto-import](https://github.com/ef4/ember-auto-import).

Using NPM packages with ember without ember-cli wrappers is a little bit cumbersome but doable.

Before start you will need 2 extra broccoli plugins (`broccoli-funnel` for moving arbitrary files and directories and `broccoli-merge-trees`):

```bash
npm install -D broccoli-funnel broccoli-merge-trees
```

1. Generate vendor shim which will be responsible by exporting the library as ES6 module:

        ember generate vendor-shim library-name

2. You should have shim code generated similar to the one below:

        // vendor/shims/library-name.js
        (function() {
          function vendorModule() {
            'use strict';

            return {
              'default': self['library-name'],
              __esModule: true,
            };
          }

          define('library-name', [], vendorModule);
        })();

3. Generate in-repo addon where you will include your shims in the import paths:

        ember generate in-repo-addon libary-name

4. Now you are ready to include library and vendor shims in the import paths:

        // lib/library-name/index.js
        var path = require('path');
        var Funnel = require('broccoli-funnel');
        var MergeTrees = require('broccoli-merge-trees');

        module.exports = {
          name: 'library-name',

          included() {
            this._super.included.apply(this, arguments);
            this.import('vendor/library-name.js');
            this.import('vendor/shims/library-name.js');
          },

          treeForVendor(vendorTree) {
            var libraryPath = path.join(this.project.root, 'node_modules', 'library');
            var libraryTree = new Funnel(libraryPath, {
              files: ['library.js'],
            });

            return new MergeTrees([vendorTree, libraryTree]);
          },
        };
