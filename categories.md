---
layout: default
title: Blog Categories
---

{% comment %}
=======================
The following part extracts all the categories from your posts and sort categories, so that you do not need to manually collect your categories to a place.
=======================
{% endcomment %}
{% assign rawcategories = "" %}
{% for post in site.posts %}
  {% assign tcategories = post.tags | join:'|' | append:'|' %}
  {% assign rawcategories = rawcategories | append:tcategories %}
{% endfor %}
{% assign rawcategories = rawcategories | split:'|' | sort %}

{% comment %}
=======================
The following part removes dulpicated categories and invalid categories like blank category.
=======================
{% endcomment %}
{% assign categories = "" %}
{% for category in rawcategories %}
  {% if category != "" %}
    {% if categories == "" %}
      {% assign categories = category | split:'|' %}
    {% endif %}
    {% unless categories contains category %}
      {% assign categories = categories | join:'|' | append:'|' | append:category | split:'|' %}
    {% endunless %}
  {% endif %}
{% endfor %}

{% comment %}
=======================
The purpose of this snippet is to list all your posts posted with a certain category.
=======================
{% endcomment %}
{% for category in categories %}
  <h2 id="{{ category }}">
    {{ category | capitalize }}
  </h2>
  <ul>
   {% for post in site.posts %}
     {% if post.tags contains category %}
     <li>
       <h3>
         <a href="{{ post.url }}">
           {{ post.title }}
         </a>
       </h3>
     </li>
     {% endif %}
   {% endfor %}
  </ul>
{% endfor %}
