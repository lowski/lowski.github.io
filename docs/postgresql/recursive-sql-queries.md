---
layout: default
title: Recursive SQL queries with PostgreSQL
date: 2021-02-14
parent: PostgreSQL
---

# Recursive SQL queries with PostgreSQL

PostgreSQL provides [WITH](https://www.postgresql.org/docs/9.6/queries-with.html){:target="_blank"} statement (known as Common Table Expression, usually referred as CTE) which allows to build recursive queries. Its structure can be described with the following sudo code:

```sql
WITH RECURSIVE cte AS (
    SELECT * FROM table WHERE table.parent_id IS NULL -- basic query
    UNION ALL
    SELECT t.* FROM table t INNER JOIN cte c ON cte.id = t.parent_id -- recursive query
) SELECT * FROM cte;
```

Let's imagine having a simple folders structure on some operating system:

```sql
CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id INT 
);

INSERT INTO folders(name, parent_id) VALUES
  ('home', NULL),
  ('root', NULL),
  ('user', 1),
  ('documents', 3),
  ('pictures', 3),
  ('downloads', 3),
  ('vacations', 5),
  ('baltic sea', 7),
  ('tatra mountains', 7);
```

We can print a list of folders and their parents using the following `RECURSIVE` query:

```sql
WITH RECURSIVE subfolders AS (
  SELECT id, name, NULL AS parent FROM folders WHERE parent_id IS NULL
  UNION ALL
  SELECT f.id, f.name, s.name FROM folders f
  INNER JOIN subfolders s ON f.parent_id = s.id
) SELECT * FROM subfolders;
```

| id | name            | parent    |
|----|-----------------|-----------|
| 1  | home            |           |
| 2  | root            |           |
| 3  | user            | home      |
| 4  | documents       | user      |
| 5  | pictures        | user      |
| 6  | downloads       | user      |
| 7  | vacations       | pictures  |
| 8  | baltic sea      | vacations |
| 9  | tatra mountains | vacations |

In the first invocation, the query finds all top-level folders. In its second iteration, it uses these root folders as input values, to find their sub-folders (`user`). In the 3rd invocation, `user` directories (`documents`, `pictures`, and `downloads`) are found. The process continues with its iterations until there are no more directories containing folders (`baltic sea` and `tatra mountains` are the last ones).

`WITH` statement can also be used to find a path of a specific folder:

```sql
WITH RECURSIVE childs AS (
    SELECT id, name, parent_id FROM folders WHERE name = 'baltic sea'
    UNION ALL
    SELECT f.id, f.name, f.parent_id FROM folders f
    INNER JOIN childs c ON f.id = c.parent_id
) SELECT id, name FROM childs;
```

| id | name       |
|----|------------|
| 8  | baltic sea |
| 7  | vacations  |
| 5  | pictures   |
| 3  | user       |
| 1  | home       |

Full examples can be found on [dbfiddle](https://dbfiddle.uk/?rdbms=postgres_13&fiddle=dc38a47bb2a0ae9a73a020f0c3d3bde9){:target="_blank"}.
