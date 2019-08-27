---
layout: default
title: Handling DOM events with Ember
date: 2019-08-25
parent: Ember.js
---

# Handling DOM events with Ember

Every `Ember.Component` can react to native DOM events by adding a method with the same name as the event (i.e.
`submit`) so you should reserve such names only for native DOM event handlers.

Quick example on [ember-twiddle](https://ember-twiddle.com/053b1438432059552d0d3a3973f5064d):

```javascript
export default Ember.Component.extend({
  submit(e) {
    e.preventDefault();
    alert("I'm native DOM event");
  }
});
```
