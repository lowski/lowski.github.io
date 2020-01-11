---
layout: default
title: Pivot functions in PostgreSQL
date: 2020-01-11
parent: PostgreSQL
---

# Pivot functions in PostgreSQL

SQL Server provides `PIVOT` and `UNPIVOT` functions to create pivot tables. Unfortunately, PostgreSQL does implement them.  However, it provides `crosstab` function from `tablefunc` extensions which is equivalent to `PIVOT`.

Let's start by explaining what pivot tables actually are.

## Pivot tables

Pivot tables allow to switch rows with columns and vice-versa to present results in a more visualized way. It's best to explain them by example.

Having a table with student's grades:

| Student | Subject   | Grade |
|=========|===========|=======|
| Alice   | Geography | 4.0   |
| Alice   | History   | 4.5   |
| Alice   | Math      | 4.0   |
| Bob     | Geography | 3.0   |
| Bob     | History   | 3.0   |
| Bob     | Math      | 3.5   |
| Charlie | Geography | 4.5   |
| Charlie | History   | 4.0   |
| Charlie | Math      | 3.0   |

Moving `Subject` from rows to columns (pivot) will result in:

| Student | Geography | History | Math |
|=========|===========|=========|======|
| Alice   | 4.0       | 4.5     | 4.0  |
| Bob     | 3.0       | 3.0     | 3.5  |
| Charlie | 4.5       | 4.0     | 3.0  |

Moving columns (`Subject` and `Grade`) to rows (unpivot) will result in:

| Student | Name    | Value     |
|=========|=========|===========|
| Alice   | subject | Geography |
| Alice   | grade   | 4         |
| Alice   | subject | History   |
| Alice   | grade   | 4.5       |
| Alice   | subject | Math      |
| Alice   | grade   | 4         |
| Bob     | subject | Geography |
| Bob     | grade   | 3         |
| Bob     | subject | History   |
| Bob     | grade   | 3         |
| Bob     | subject | Math      |
| Bob     | grade   | 3.5       |
| Charlie | subject | Geography |
| Charlie | grade   | 4.5       |
| Charlie | subject | History   |
| Charlie | grade   | 4         |
| Charlie | subject | Math      |
| Charlie | grade   | 3         |

## Pivoting PostgreSQL

The `crosstab` function from `tablefunc` extension allows performing a pivot. It receives SQL query following requirements as:

- it must return 3 columns
- the first column needs to identify each row of the result table (student in our example)
- the second column represents categories of pivot table - values will expand to columns of the table
- the third column represents values assigned to each cell

Query backing the pivot example from above looks as follows:

```sql
SELECT * 
FROM crosstab('SELECT student, subject, grade FROM grades order by 1,2') 
  AS final_result(Student TEXT, Geography FLOAT, History FLOAT, Math Float);
```

The unpivot one uses `JOIN LATERAL` though (we have to cast `grade` column so it is of the same type as `subject`):

```sql
SELECT student, name, value
FROM grades
JOIN LATERAL (VALUES('subject', grades.subject), ('grade', cast(grade AS text))) s(name, value) ON true
```

Full example can be found on [dbfidle](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=407a37686238bb3fbcbc4285d1705871){:target="_blank"}.
