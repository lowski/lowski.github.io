---
layout: default
title: Prettifying Ember.js codebase
date: 2020-06-28
parent: Ember.js
---

# Prettifying Ember.js codebase

All Ember-CLI based apps come with pre-defined `eslint` config. Unfortunately it's not enough to enforce code consistency across the whole codebase. That's where [prettifier](https://www.prettifier.net/){:target="_blank"} comes into play.

To configure `prettifier` with existing Ember app:

1. Install `prettier`, `eslint-plugin-prettier` (to run prettier as an ESLint rule) and `eslint-config-prettier`(to turn off all ESLint rules that might conflict with prettier):

   ```bash
   yarn add --dev prettier eslint-plugin-prettier eslint-config-prettier
   ```

2. Add `prettier` plugins to `.eslintrc.js` file:

    ```javascript
    module.exports = {
      root: true,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          legacyDecorators: true,
        },
      },
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'prettier',
      ],
      env: {
        browser: true
      },
      plugins: [
        'ember',
        'prettier',
      ],
    };
    ```

3. Add `prettier` rules to `.prettierrc.js`:

    ```javascript
    module.exports = {
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 100,
      semi: true,
      bracketSpacing: true,
      endOfLine: 'lf',
      tabs: false,
      tabWidth: 2,
    };
    ```

4. Install `lint-staged` (to lint staged files) and `husky` (to run custom scripts on git hooks):

   ```bash
   yarn add lint-staged husky --dev
   ```

5. Add scripts to `package.json`:

   ```json
   // package.json
   {
     "scripts": {
       "precommit": "lint-staged"
     },
     "lint-staged": {
       "*.{js,json,css}": [
         "prettier --write",
         "git add"
       ]
     }
   }
   ```

Now, before each commit, `prettifier` will be run to ensure that consistency is preserved on all changed files. 
