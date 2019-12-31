---
layout: default
title: Conditional joins with Hanami
date: 2019-12-31
parent: Ruby
---

# Conditional joins with Hanami

Conditional join is very useful concept that allows to filter records before joining them with other collection. It's helpful when finding a record without specific association is desired.

Imagine we want to find users who don't have any published posts:

```sql
SELECT users.*
FROM users
LEFT JOIN posts ON users.id = posts.user_id
AND posts.status = 'published'
WHERE posts.id IS NULL
```

We filter posts (to include only `published` ones) before joining them with users to ensure only published posts are included in the collection. Once we have it, we can filter users without posts out (`WHERE posts.id IS NULL`).

If we move the condition from `JOIN` to `WHERE` clause, we will receive no results. Firstly, database joins all users with their posts and then try to include only those, whose posts are published and those who doesn't have any posts at the same time. This condition is actually impossible - posts can't be filtered based on their status if they don't exist.

Using Hanami repositories, we can create above query as follows:

```ruby
users
  .qualified
  .left_join(
    :posts,
    posts[:user_id].qualified => users[:id].qualified,
    status: 'published'
  )
  .where(posts[:id].qualified => nil)
  .to_a
```
