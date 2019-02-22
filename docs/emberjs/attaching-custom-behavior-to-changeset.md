---
layout: default
title: Attaching custom behavior to changeset
date: 2019-02-22
parent: Ember.js
---

# Attaching custom behavior to changeset

Recently I've encountered a very interesting case. I wanted to re-use computed properties from the model on the [changeset](https://github.com/poteto/ember-changeset) so when new values are assigned, derived values are immediateluy recalculated (for the preview purpose). Those properties need to be defined on the changeset because they are not propagated to the model until you call `changeset.execute()`.

To better explain my use case, I'm providing code snippets below.

1. Computed property to calculate `subtotals` based on the `items`:

    ```javascript
    subTotals: computed('items.[]', 'items.@each.taxRate', function() {
      const taxRates = this.get('items').mapBy('taxRate').uniq();
      return taxRates.map((taxRate) => {
        const items = this.get('items').filterBy('taxRateCode', taxRate.code);
        return Subtotal.create({ items, taxRate });
      });
    })
    ```

2. Attaching mixin to the changeset instance:

    ```javascript
    import Component from '@ember/component';
    import lookupValidator from 'ember-changeset-validations';
    import { action } from '@ember-decorators/object';
    import { changeset } from 'ember-changeset';

    ...

    export default class InvoiceFormComponent extends Component {
      @computed('invoice')
      get changeset() {
        let Changeset = changeset(this.invoice,
                                  lookupValidator(InvoiceValidation),
                                  InvoiceValidation);
        Changeset.reopen(InvoiceDecorator);
        return Changeset.create();
      }
    }
    ```

I use `changeset` factory which dynamically generates changeset class. Then I reopen it to include my mixin. Once my `Changeset` class is defined, I simply initialize a new instance.

Unfortunately I've encountered another problem - `model#items` was also a computed property (generated from raw `itemsAttributes`):

```javascript
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  items: computed('itemsAttributes.@each', function() {
    return (this.get('itemsAttributes') || []).map((attrs) => Item.create(attrs));
  }),

  subTotals: computed('items.[]', 'items.@each.taxRate', function() {
    const taxRates = this.get('items').mapBy('taxRate').uniq();
    return taxRates.map((taxRate) => {
      const items = this.get('items').filterBy('taxRateCode', taxRate.code);
      return Subtotal.create({ items, taxRate });
    });
  })
});
```

I had to figure out how to correctly propagate changes on `items` in the changeset to `itemsAttributes` in the model. It actually turned out to be as simple as overriding `execute` function on the changeset:

```javascript
Changeset.reopen({
  execute() {
    this.set('itemsAttributes', this.get('items').invoke('toJSON'));
    return this._super();
  }
});
```

Now when I call `changeset.save()`, changes in the `Items` are correctly propagated to the `model#itemsItributes` and then via computed property to the `model.items`.

Here is the full code for custom changeset:

```javascript
let Changeset = changeset(this.invoice,
                          lookupValidator(InvoiceValidation),
                          InvoiceValidation);
Changeset.reopen(InvoiceDecorator);
Changeset.reopen({
  execute() {
    this.set('itemsAttributes', this.get('items').invoke('toJSON'));
    return this._super();
  }
});

return Changeset.create();
```
