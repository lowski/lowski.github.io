---
layout: default
title: Finding most recent children for a record in PostgreSQL
date: 2021-04-11
parent: PostgreSQL
---

# Finding most recent children for a record in PostgreSQL

Sometimes we need to find a most recent / popular, or oldest (those cases are similar, and differ in a condition clause only) for a specific record (i.e. most recent post for each user).

This can be achieved with at least 2 methods which we will compare through the example of user notes:

| id | user_id | content        | created_at          |
|----|---------|----------------|---------------------|
| 1  | 1       | Alice Note 1   | 2021-01-01 15:30:00 |
| 2  | 2       | Bob Note 1     | 2021-01-02 13:00:00 |
| 3  | 3       | Charlie Note 1 | 2021-01-01 10:00:00 |
| 4  | 1       | Alice Note 2   | 2021-02-01 11:00:00 |
| 5  | 2       | Bob Note 2     | 2021-01-20 12:00:00 |
| 6  | 1       | Alice Note 3   | 2021-03-01 13:00:00 |

| id | name    |
|----|---------|
| 1  | Alice   |
| 2  | Bob     |
| 3  | Charlie |

*`notes` table contains compound index on `user_id`, `created_at` columns to improve the performance.*

## Sub-select join

```sql
SELECT latest_notes.*
FROM notes AS latest_notes
LEFT JOIN notes AS user_notes
ON latest_notes.user_id = user_notes.user_id
AND user_notes.created_at > latest_notes.created_at
WHERE user_notes.id IS NULL;
```

Relies on loading notes from index twice (for `user_notes`, and `latest_notes`), and combining them together (with filters on top) - [merge left join](https://use-the-index-luke.com/sql/join/sort-merge-join){:target="_blank"}.

## Left join

```sql
SELECT notes.*
FROM (
  SELECT user_id, MAX(created_at) AS created_at
  FROM notes
  GROUP BY notes.user_id
) AS latest_notes
INNER JOIN notes
ON notes.user_id = latest_notes.user_id
AND notes.created_at = latest_notes.created_at
```

Relies on scanning all notes into hash table, and probing them quickly with results from sub-select - [hash join](https://use-the-index-luke.com/sql/join/hash-join-partial-objects){:target="_blank"}.

*This will not work, if more than one user note can has the same `created_at` (if creation date is assigned automatically, we can use `MAX(id)` instead)*

## Performance

| Method          | Cost          | Actual Time  |
|-----------------|---------------|--------------|
| Sub-select join | 33.05.. 59.37 | 0.040..0.043 |
| Left join       | 0.30.. 231.27 | 0.018..0.024 |

We see that estimated cost of `Sub-select` join is less fluctual, and might lead to better result but the actual time favors `Left join` in our case (keep in mind our data-set is very small, and definitely does not represent real-world scenario).

Full examples from the note can be found on [dbfiddle](https://dbfiddle.uk/?rdbms=postgres_13&fiddle=63159e899d01f045f0dae71ee7a611d8){:target="_blank"}.
