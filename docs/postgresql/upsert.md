---
layout: default
title: Upsert in PostgreSQL
date: 2020-02-01
parent: PostgreSQL
---

# Upsert in PostgreSQL

PostgreSQL supports update `ON CONFLICT` clause for `INSERT` statement to update existing record if it already exists.

Having a table of people:

| id | first_name | last_name |
|====|============|===========|
| 1  | Alice      | Jackson   |
| 2  | Bob        | Lynch     |

To upsert a new record, `ON CONFLICT` with `DO UPDATE` for `INSERT` command is required:

```sql
INSERT INTO people(id, first_name, last_name) VALUES
  (1, 'Alice', 'Turner')
ON CONFLICT(id)
DO UPDATE SET first_name = 'Alice', last_name = 'Turner';
```

Result:

| id | first_name | last_name |
|====|============|===========|
| 1  | Alice      | Turner    |
| 2  | Bob        | Lynch     |

## MERGE alternative

Comparing to other database engines, it seems a bit primitive - i.e. SQL Server `MERGE` command can be used to synchronize data with support for removing orphan records. Full command looks as follows:

```sql
MERGE INTO people
USING (VALUES
  (1, 'Alice', 'Turner'),
  (3, 'Charlie', 'Ross')
) friends(id, first_name, last_name)
ON people.id = friends.id
WHEN NOT MATCHED THEN
  INSERT (first_name, last_name) VALUES (friends.first_name, friends.last_name)
WHEN MATCHED THEN
  UPDATE SET people.first_name = friends.first_name,
             people.last_name = friends.last_name
WHEN NOT MATCHED BY SOURCE THEN
  DELETE;
```

Result:

| id | first_name | last_name |
|====|============|===========|
| 1  | Alice      | Turner    |
| 3  | Charlie    | Ross      |

`MERGE` was planned to be added to PostgreSQL 11. Unfortunately it was [reverted by the author](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commitdiff;h=08ea7a2291db21a618d19d612c8060cda68f1892).

Full examples can be found on dbfidle: [upsert](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=43dec9636c7aa9ba846150fe34be58b7){:target="_blank"}, [merge](https://dbfiddle.uk/?rdbms=sqlserver_2016&fiddle=31ef328cae5620ac74c3e09b6ef62f65){:target="_blank"}.
