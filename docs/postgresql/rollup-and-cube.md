---
layout: default
title: ROLLUP and CUBE with PostgreSQL
date: 2020-01-26
parent: PostgreSQL
---

# ROLLUP and CUBE with PostgreSQL

`ROLLUP` and `CUBE` are extensions to `GROUP BY` clause to include extra subtotal rows (commonly called super-aggregate rows) with the grant total row.

## Rollup

`ROLLUP` generates subtotal rows for a hierarchy of values in the grouping columns. The easiest way to present it is on the example:

```sql
SELECT location, SUM(quantity) FROM sales
GROUP BY ROLLUP(location);
```

| location      | sum |
|===============|=====|
| *null*        | 405 |
| Shanghai      | 220 |
| San Francisco | 160 |
| London        | 25  |

Multiple subtotals can be used with groups using more than 1 column:

```sql
SELECT location, product, SUM(quantity) FROM sales
GROUP BY ROLLUP(location, product)
ORDER BY location, product;
```

| location      | product | sum |
|===============|=========|=====|
| London        | iMac    | 15  |
| London        | Macbook | 10  |
| London        | *null*  | 25  |
| San Francisco | iMac    | 70  |
| San Francisco | Macbook | 50  |
| San Francisco | Mac Pro | 40  |
| San Francisco | *null*  | 160 |
| Shanghai      | iMac    | 70  |
| Shanghai      | Macbook | 150 |
| Shanghai      | *null*  | 220 |
| *null*        | *null*  | 405 |

`COALESCE` might be handy to get rid of those ambiguous `NULL` values:

```sql
SELECT
  COALESCE(location, 'All locations') AS location,
  COALESCE(product, 'All products') AS product,
  SUM(quantity)
FROM sales
GROUP BY ROLLUP(location, product)
ORDER BY location, product;
```

| location      | product      | sum |
|===============|==============|=====|
| All locations | All products | 405 |
| London        | All products | 25  |
| London        | iMac         | 15  |
| London        | Macbook      | 10  |
| San Francisco | All products | 160 |
| San Francisco | iMac         | 70  |
| San Francisco | Macbook      | 50  |
| San Francisco | Mac Pro      | 40  |
| Shanghai      | All products | 220 |
| Shanghai      | iMac         | 70  |
| Shanghai      | Macbook      | 150 |

## Cube

`CUBE` generates subtotal rows for all combinations of values in the grouping columns. Let's take a look at another example:

```sql
SELECT
  COALESCE(location, 'All locations') AS location,
  COALESCE(product, 'All products') AS product,
  SUM(quantity)
FROM sales
GROUP BY CUBE(location, product)
ORDER BY location, product;
```

| location      | product      | sum |
|===============|==============|=====|
| All locations | All products | 405 |
| All locations | iMac         | 155 |
| All locations | Macbook      | 210 |
| All locations | Mac Pro      | 40  |
| London        | All products | 25  |
| London        | iMac         | 15  |
| London        | Macbook      | 10  |
| San Francisco | All products | 160 |
| San Francisco | iMac         | 70  |
| San Francisco | Macbook      | 50  |
| San Francisco | Mac Pro      | 40  |
| Shanghai      | All products | 220 |
| Shanghai      | iMac         | 70  |
| Shanghai      | Macbook      | 150 |

Full examples can be found on [dbfiddle](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=8b8cc5af6b10dd07c13db65945ee7c7a){:target="_blank"}.
