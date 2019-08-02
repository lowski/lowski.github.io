---
layout: home
---

{{content}}

<h2 class="text-delta">Latest posts</h2>
<p class="posts-list">
  {% assign pages_list = site.html_pages | sort:"date" | reverse %}
  {% for node in pages_list %}
    {% if node.parent %}
      <a href="{{ node.url | absolute_url }}">{{ node.date }} - {{ node.title }}</a><br />
    {% endif %}
  {% endfor %}
</p>
