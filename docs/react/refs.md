---
layout: default
title: Refs in React
date: 2018-02-17
parent: React
---

# Refs in React

React's `ref` attribute allows React component to access underlying DOM node. Since `ref` needs a backing instance it won't work with functional components.

Besides strings, refs also support a callback that gets called after the component is mounted so you can do some initialization there.

## Example

With string:

```html
<input type="text" ref="input" />

...

// Access in the component
this.refs.input
```

With callback:

```html
<input type="text" ref={element => element.focus()} />
```