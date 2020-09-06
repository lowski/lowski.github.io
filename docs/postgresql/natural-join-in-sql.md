---
layout: default
title: Natural join in SQL
date: 2020-09-06
parent: PostgreSQL
---

# Natural join in SQL

Not as popular as other type of joins (`INNER`, `OUTER`, etc.), a `NATURAL JOIN` allows to implicitly combine tables based on the same column names present in both of them.

Given 3 tables:

```
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE brands (
  brand_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  brand_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_brand FOREIGN KEY(brand_id) REFERENCES brands(brand_id),
  CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES categories(category_id)
);
```

Natural join between `products` and `categories` gives:

```sql
SELECT products.*, categories.*
FROM products
NATURAL JOIN categories;
```

| product_id | brand_id | category_id | title        | created_at          | category_id | name    |
|------------|----------|-------------|--------------|---------------------|-------------|---------|
| 1          | 1        | 1           | Macbook Pro  | 2020-01-01 00:00:00 | 1           | laptops |
| 2          | 1        | 2           | iPhone SE    | 2020-01-02 00:00:00 | 2           | phones  |
| 3          | 1        | 3           | iPad Air     | 2020-01-03 00:00:00 | 3           | tablets |
| 4          | 2        | 1           | Pixelbook GO | 2020-01-04 00:00:00 | 1           | laptops |
| 5          | 2        | 2           | Pixel 5      | 2020-01-05 00:00:00 | 2           | phones  |
| 6          | 3        | 1           | Surface 3    | 2020-01-06 00:00:00 | 1           | laptops |

But similar join between `products` and `brands`:

```sql
SELECT products.*, brands.*
FROM products
NATURAL JOIN brands;
```

Gives only 1 record:

| product_id | brand_id | category_id | title       | created_at          | brand_id | name  | created_at          |
|------------|----------|-------------|-------------|---------------------|----------|-------|---------------------|
| 1          | 1        | 1           | Macbook Pro | 2020-01-01 00:00:00 | 1        | Apple | 2020-01-01 00:00:00 |

It comes from the fact that both `products` and `brands` tables besides `brand_id`, have also `created_at` in common which is implicitly used by natural join.

## Finding 

One of the use cases where `NATURAL JOIN` might be useful is comparing 2 tables:

```sql
CREATE TABLE t1 (
  a INT,
  b INT
);

CREATE TABLE t2 (
  a INT,
  b INT
);
```

```sql
INSERT INTO t1 VALUES
  (1, 2),
  (3, 4),
  (5, 6);

INSERT INTO t2 VALUES
  (3, 4),
  (5, 6),
  (7, 8);
```

To find values that are present in table `t1` but not in `t2` and vice-versa, a natural full join might be handy:

```sql
SELECT *
FROM (
  SELECT 't1' AS t1, t1.* FROM t1
) t1
NATURAL FULL JOIN (
  SELECT 't2' AS t2, t2.* FROM t2
) t2
WHERE t1 IS NULL OR t2 IS NULL;
```

Result:

| a | b | t1 | t2 |
|---|---|----|----|
| 1 | 2 | t1 |    |
| 7 | 8 |    | t2 |

Full join here, ensures that we have values present only in `t1`, only in `t2` and in both tables. Then `t1 IS NULL OR t2 IS NULL` filters common ones out.

Full examples from the note can be found on [dbfiddle](https://dbfiddle.uk/?rdbms=postgres_12&fiddle=8daf17bd8051cb74c7d076701db52e34){:target="_blank"}.
