---
layout: default
title: Moving data from database column to jsonb field
date: 2019-11-07
parent: PostgreSQL
---

# Moving data from database column to jsonb field

There are cases when data needs to be moved from regular database column to `jsonb` based field. Likewise with every database migration existing data needs to be retained as part of the process.

Let's see how we can do it using regular SQL commands and then through Rails migration. Imagine we need to move `token` from `users` table into `token` inside `credentials` jsonb based field in the same table.

Firstly, we need to add a new column:

```sql
ALTER TABLE users
ADD COLUMN credentials jsonb;
```

Then we need to migrate the data:

```sql
UPDATE users
SET credentials = COALESCE(credentials, '{}')::jsonb || jsonb_build_object('token', users.token);
```

And finally, add index to that nested field:

```sql
CREATE UNIQUE INDEX users_credentials_token ON users USING btree ((credentials->>'token'::text));
```

## Rails version

With Rails, it can be done within single migration:

```ruby
def change
  add_column :users, :credentials, :jsonb
  add_index :users, "(credentials->>'token')", unique: true

  reversible do |dir|
    dir.up do
      execute <<~SQL
        UPDATE users
        SET credentials = COALESCE(credentials, '{}')::jsonb || jsonb_build_object('token', users.token)
      SQL
    end
  end
end
```
