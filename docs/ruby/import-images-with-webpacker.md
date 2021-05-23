---
layout: default
title: Importing images with Webpacker
date: 2021-05-23
parent: Ruby
---

# Importing images with Webpacker

Webpacker is Rails default solution for managing JavaScript modules within the application. Not everyone knows it but it can also be used for other assets like CSS, static files (i.e. images), or fonts, and completely substitute Sprockets on the field.

## Importing CSS

To import CSS / SCSS file, just import the stylesheet file like a normal Javascript module (for SCSS make sure you have `sass-loader`, and `sass` packages installed) to your `application.js` pack:

```javascript
import "../../stylesheets/application.scss"
```

Then add stylesheet pack to the template:

```erb
<!-- app/layouts/application.html.erb -->
<%= stylesheet_pack_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
```

## Importing static files

Static files can be imported the same way as stylesheets (Webpacker supports libraries from `node_modules` directory out of the box - here I'm using icons from [tabler-icons](https://github.com/tabler/tabler-icons){:target="_blank"}. package):

```javascript
import "@tabler/icons/icons/trash.svg"
import "../../images/logo.png"
```

If you want to import all files from `images` directory, use [require.context](https://webpack.js.org/guides/dependency-management/#requirecontext){:target="_blank"} with `useSubdirectories` parameter set to `true`:

```javascript
require.context('../../images', true)
```
Then, use `image_pack_tag` helper (remember to prefix paths with `media` directory) to add `<img>` tag to the
template:

```erb
<%= image_pack_tag 'media/images/logo.png' %>
<%= image_pack_tag 'media/icons/trash.svg' %>
```

To import images into the stylesheet, use regular `url` expression (with `~` prefix for files coming from `node_modules` folder):

```css
.logo {
  background: url("../images/logo.png")
}

.icon {
  background-image: url('~@tabler/icons/icons/trash.svg')
}
```

### Importing SVG images

To display SVG files inline (i.e. to modify their styles via CSS), install [inline_svg](https://github.com/jamesmartin/inline_svg){:target="_blank"} gem, and use `inline_svg_pack_tag` helper (`media/` prefix is also needed) to add `<svg>` tag to the template:

```erb
<%= inline_svg_pack_tag 'media/icons/trash.svg' %>
```

## Additional resources

For more advanced Webpacker topics, [Ross Kaffenberger's blog](https://rossta.net/blog/){:target="_blank"} is great place to start diving down the rabbit hole ;) .
