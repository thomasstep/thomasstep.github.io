---
layout: default
title: thomasstep.com
show_mailchimp_signup: true
---

**To see my blog posts sorted by category, [please click here](/categories).**

---

{% for post in site.posts %}
  <p><a href="{{ post.url }}">{{ post.title }}</a> <br> {{ post.date | date: "%-d %B %Y" }}</p>
  {% assign tcategories = post.tags | join:'|' | append:'|' %}
  {% assign rawcategories = rawcategories | append:tcategories %}
{% endfor %}
