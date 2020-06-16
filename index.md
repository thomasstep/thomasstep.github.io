---
layout: default
---

{% for post in site.posts %}
  <p><a href="{{ post.url }}">{{ post.title }}</a> <br> {{ post.date | date: "%-d %B %Y" }}</p>
  {% assign tcategories = post.tags | join:'|' | append:'|' %}
  {% assign rawcategories = rawcategories | append:tcategories %}
{% endfor %}
