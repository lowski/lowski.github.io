---
layout: default
title: Attaching custom behavior to changeset
date: 2019-02-22
parent: Ember.js
---

# Attaching custom behavior to changeset

Recently I've encountered a very interesting case: I wanted to re-use model's computed properties on the [changeset](https://github.com/poteto/ember-changeset) so when new values were assigned, derived values were immediately updated. Computed properties had to be attached to the changeset (even though they were already defined on the model) because changes are not propagated to the model until they are valid during `changeset.execute()`call (which is used under the hood by `changeset.save()`).

Here is short code sample presenting how it was supposed to work:

```javascript
changeset.set('items:fistObject').set('taxRate', newValue);
changeset.get('subTotals')
```

`subtotals` was a computed property based on the `items` attribute. It simply grouped them based on `taxRate` field and passed to a new `Subtotal` instance:

```javascript
subTotals: computed('items.[]', 'items.@each.taxRate', function() {
  const taxRates = this.get('items').mapBy('taxRate').uniq();
  return taxRates.map((taxRate) => {
    const items = this.get('items').filterBy('taxRate', taxRate);
    return Subtotal.create({ items, taxRate });
  });
});
```

Here is how I attached my mixin to the changeset instance:

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

I used `changeset` factory function which generate a `Changeset` class. Then I reopened it to include my mixin. Once my `Changeset` class was fully defined, I simply initialized a new instance.

Unfortunately I encountered another problem - `model.items` was actually a computed property (derived from `itemsAttributes` field):

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

So the last remaining piece was to propagate changes on `items` in the `changeset` to `itemsAttributes` on the model. It actually turned out to be as simple as overriding `execute` function on the changeset:

```javascript
Changeset.reopen({
  execute() {
    this.set('itemsAttributes', this.get('items').invoke('toJSON'));
    return this._super();
  }
});
```

Now when I called `changeset.save()`, changes in the `Items` were correctly propagated to the `model.itemsItributes` and then via computed property to the `model.items`.

Here is the full code for my custom changeset:

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
