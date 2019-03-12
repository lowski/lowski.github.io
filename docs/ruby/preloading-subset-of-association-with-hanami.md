---
layout: default
title: Preloading subset of association with Hanami
date: 2019-03-12
parent: Ruby
---

## Preloading subset of association with Hanami

Preloading associated records is not always obvious - especially when only specific items should be loaded, i.e. `blog`  with `posts` published within given range. As Hanami's repositories are Ruby classes there a lot of possibilities - here is one of them:

```ruby
class BlogRepository < Hanami::Repository
  associations do
    has_many :posts 
  end

  def find_with_posts(id:, start_date:, end_date:)
    result = find(id).to_h

    return unless result.blank?

    posts = PostsRepository.new.between(blog_id: id, start_date: start_date, end_date: end_date)
    Blog.new(result.merge(posts: posts))
  end
end

class PostsRepository < Hanami::Repository
  def between(blog_id:, start_date:, end_date:)
    posts.where(blog_id: blog_id)
         .where { published_at >= start_date }
         .where { published_at <= end_date }
  end
end
```

`find_with_posts` method simply merges results from 2 separate database queries (`BlogRepository#find` and `PostsRepository#between`) and passes them to the `Blog`'s constructor. If blog cannot be found, it returns `nil` without calling `PostsRepository`.

You might ask why not to use built-in `where` operator like this:

```ruby
blog.aggregates(:posts)
    .where { published_at >= start_date }
    .where { published_at <= end_date }
```

Because it would load blogs which have posts published within given range with all posts associated with them.
