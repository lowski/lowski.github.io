---
layout: home
---

{{content}}

<h2 class="text-delta">Latest posts</h2>
<ul>
  {% assign pages_list = site.html_pages | sort:"date" | reverse %}
  {% for node in pages_list %}
    {% if node.parent %}
      <li>
        <a href="{{ node.url | absolute_url }}">{{ node.parent }}: {{ node.title }} - {{ node.date }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>
