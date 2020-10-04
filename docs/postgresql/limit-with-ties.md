---
layout: default
title: Limit with ties in PostgreSQL
date: 2020-10-04
parent: PostgreSQL
---

# Limit with ties in PostgreSQL

PostgreSQL 13 introduced a new option for `LIMIT` clause (specifically for `FETCH FIRST` version) that includes additional rows in the result set if their rank is equal to the last row.

Given an `employees` table:

| id | name    | salary |
|====|=========|========|
| 1  | Alice   | 2000   |
| 2  | Bob     | 3000   |
| 3  | Charlie | 2000   |
| 4  | David   | 2000   |
| 5  | Eddie   | 1500   |

One of the following commands could be used to get the first two ones with the highest salary:

```sql
SELECT * FROM employees
ORDER BY salary DESC
LIMIT 2;
```

or

```sql
SELECT * FROM employees
ORDER BY salary DESC
FETCH FIRST 2 ROWS ONLY;
```

Unfortunately, they will not include all employees with salary of `2000`:

| id | name  | salary |
|====|=======|========|
| 2  | Bob   | 3000   |
| 1  | Alice | 2000   |

To include all of them, `WITH TIES` clause needs to be used:

```sql
SELECT * FROM employees
ORDER BY salary DESC
FETCH FIRST 2 ROWS WITH TIES;
```

| id | name    | salary |
|====|=========|========|
| 2  | Bob     | 3000   |
| 1  | Alice   | 2000   |
| 3  | Charlie | 2000   |
| 4  | David   | 2000   |

Full example can be found on [dbfidle](https://dbfiddle.uk/?rdbms=postgres_13&fiddle=8d0f53114ebc65f0d8164eb0803db419){:target="_blank"}.
