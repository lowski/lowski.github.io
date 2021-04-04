---
layout: default
title: Update primary key with foreign constraints
date: 2021-04-04
parent: PostgreSQL
---

# Update primary key with foreign references

By default, it's not possible to update value of a primary key if it's referenced by other foreign constraints without dropping the constraint first (even in transaction).

Let's take a look at the example to illustrate the problem. Imagine there are 2 tables in the database - `notes`, and `users`, with a following structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INT,
  content TEXT,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
```

and a following data set:

| id | name  |
|----|-------|
| 1  | Alice |
| 2  | Bob   |


| id | user_id | content      |
|----|---------|--------------|
| 1  | 1       | Alice Note 1 |
| 2  | 1       | Alice Note 2 |
| 3  | 2       | Bob Note     |

If we try to update user's id in transaction:

```sql
BEGIN;
UPDATE users SET id=3 WHERE id=1;
UPDATE notes SET user_id=3 WHERE user_id=1;
COMMIT;
```

PostgreSQL is going to throw error:

```
ERROR:  update or delete on table "users" violates foreign key constraint "fk_user" on table "notes"
DETAIL:  Key (id)=(1) is still referenced from table "notes".
```

To make it work, we need to switch a `session_replication_role` for our session to `replica`:

```sql
BEGIN;
SET session_replication_role='replica';
UPDATE users SET id=3 WHERE id=1;
UPDATE notes SET user_id=3 WHERE user_id=1;
SET session_replication_role='original';
COMMIT;
```

## What exactly is a `session_replication_role`?

`session_replication_role` allows to specify the behavior for triggers, and rewrite rules for the current session. It supports following values:

- `origin` (default)
- `replica` used by replication systems to apply changes during replication
- `local` (treated equally by PostgreSQL internally, but might be used differently by a 3rd party replication systems)

Since foreign key constrains are implemented as triggers, switching `session_replication_role` to `replica` allows us to bypass the constraints.

Example of the problem on [dbfiddle](https://dbfiddle.uk/?rdbms=postgres_13&fiddle=6b1f420852930176cf64d4493bf6c1ed){:target="_blank"}.
