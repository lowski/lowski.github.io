---
layout: default
title: Using libraries from NPM Ember
date: 2017-12-10
parent: Ember.js
---

# Using libraries from NPM with Ember

UPDATE: All those manual steps can be replaced with [ember-auto-import](https://github.com/ef4/ember-auto-import).

Using NPM packages with ember without ember-cli wrappers is actually possible but it requires 2 broccoli plugins:

- `broccoli-funnel` for moving arbitrary files and directories
- `broccoli-merge-trees` - for merging trees

Here is quick cheatsheet how to make it work:

1. Install dependencies:

    ```bash
    npm install -D broccoli-funnel broccoli-merge-trees
    ```

2. Generate vendor shim which will be responsible by exporting the library as ES6 module:

    ```bash
     ember generate vendor-shim library-name
    ```

3. It should generate shim code similar to the one below:

    ```javascript
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
    ```

4. Generate in-repo addon where you will include your shims in the import paths:

   ```bash
    ember generate in-repo-addon libary-name
   ```

5. Include library and vendor shims in the import paths:

   ```javascript
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
   ```
