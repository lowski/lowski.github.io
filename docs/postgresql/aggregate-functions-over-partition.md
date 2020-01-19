---
layout: default
title: Aggregate functions over partition in PostgreSQL
date: 2020-01-19
parent: PostgreSQL
---

# Aggregate functions over partition in PostgreSQL

Aggregate functions are usually used with `GROUP BY` clauses to perform aggregations on a set of rows (group).

Sometimes, there are cases when aggregates need to be run on different query levels (row vs group). In such situation `OVER` function might be very handy. It allows to either run function on across all rows or specific ones (`PARTITION`).

## The most basic example

Having table of products and categories:

| category_id | name    |
|=============|=========|
| 1           | Laptops |
| 2           | Phones  |
| 3           | Tablets |

| product_id | name           |
|============|================|
| 1          | Macbook Pro    |
| 2          | Macbook Air    |
| 3          | iPhone 11      |
| 4          | Google Pixel 4 |
| 5          | iPad Mini 4    |
| 6          | iPad           |

| category_id | product_id |
|=============|============|
| 1           | 1          |
| 1           | 2          |
| 2           | 3          |
| 2           | 4          |
| 3           | 5          |
| 3           | 6          |

Let's say you would like to perform a query that returns the number of products in all categories next to the category's id:

```sql
SELECT categories_products.category_id,
  COUNT(*) OVER() AS all_products
FROM categories_products;
```

By using `OVER()` you specify that the aggregate function (`COUNT` in this case) that should be executed across all the rows (`OVER()` is equivalent to empty `GROUP BY`).

As a result, you receive a table where row related data is mixed with aggregation result across all rows:

| category_id | all_products |
|=============|==============|
| 1           | 6            |
| 1           | 6            |
| 2           | 6            |
| 2           | 6            |
| 3           | 6            |
| 3           | 6            |

## Nested aggregate functions

In `GROUP BY` queries, aggregate functions can not be nested unless they are used with `OVER` clause.

Let's say we want to calculate products within each category but also have the information about the number of all products in the table:

```sql
SELECT
  categories.category_id,
  categories.name,
  COUNT(*) AS products,
  SUM(COUNT(*)) OVER() AS all_products
FROM categories_products
INNER JOIN categories
ON categories.category_id = categories_products.category_id
GROUP BY categories.category_id, categories.name;
```

Result:

| category_id | name    | products | all_products |
|=============|=========|==========|==============|
| 1           | Laptops | 2        | 6            |
| 2           | Phones  | 2        | 6            |
| 3           | Tablets | 2        | 6            |

Nested `SUM(COUNT(*))` function, sums `COUNT(*)` result ran across all the groups (`OVER()`).

## Partition

If aggregate functions need to be executed on a specific set of rows, `OVER (PARTITION...)` may come to the rescue.

Let's say we want to calculate products within each category but also have the information about all products in the table (the same example as above) but without using `GROUP BY`:

```sql
SELECT DISTINCT
  categories.category_id,
  categories.name,
  COUNT(categories_products.product_id) OVER(PARTITION BY categories_products.category_id) AS products,
  COUNT(categories_products.product_id) OVER() AS all_products
FROM categories
INNER JOIN categories_products
ON categories.category_id = categories_products.category_id
```

In this case, `OVER(PARTITION BY categories_products.category_id)` works similarly as `GROUP BY categories.id` above but is executed in the context of each row.

The result is also the same as for the query above:

| category_id | name    | products | all_products |
|=============|=========|==========|==============|
| 1           | Laptops | 2        | 6            |
| 2           | Phones  | 2        | 6            |
| 3           | Tablets | 2        | 6            |

Full example can be found on [dbfidle](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=0982f87a71197d69c689d6d9d8dae085){:target="_blank"}.
