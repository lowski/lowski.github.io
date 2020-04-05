---
layout: default
title: Text search with PostgreSQL
date: 2020-04-05
parent: PostgreSQL
---

# Text search with PostgreSQL

Imagine a simple table with famous quotes:

```sql
CREATE TABLE quotes (
  id SERIAL NOT NULL PRIMARY KEY,
  value VARCHAR
);
```

The easiest way to search through them with PostgreSQL is by using `LIKE` or `ILIKE` (case-sensitive / case-insensitive) operators with wild card symbol:

```sql
SELECT * FROM quotes WHERE value ILIKE 'life%';
```

or

```sql
SELECT * FROM quotes WHERE value ILIKE '%life%';
```

For simple phrases and small data set it might be sufficient. Unfortunately for more complex searches and larger data, it might cause a few problems:

- not using indexes for wild card phrases (search needs to perform a full table scan)
- not supporting stemming (i.e. searching for rats will not include rat)
- not supporting multiple conditions (i.e. or / and); just another `LIKE` / `ILIKE` condition is required

The first issue can be solved by using `pg_trgm` extension, second and third ones by using `ts_vectors` and `ts_queries`.

## pg_trgm

`pg_trgm` extension provides functions for determining a similarity between texts based on trigrams. According to [PostgreSQL documentation](https://www.postgresql.org/docs/11/pgtrgm.html): "A trigram is a group of three consecutive characters taken from a string. We can measure the similarity of two strings by counting the number of trigrams they share. This simple idea turns out to be very effective for measuring the similarity of words in many natural languages.".

In order to use it, extension needs to be enabled:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Then it can be used to create an index:

```sql
CREATE INDEX quotes_value_idx ON quotes USING GIN (value gin_trgm_ops);
```

Analyzing the query shows that for this particular search, it's faster to perform a sequential scan than use index:


```sql
EXPLAIN ANALYZE
SELECT * FROM quotes WHERE value LIKE '%life%';
```

```
Seq Scan on quotes  (cost=0.00..1.83 rows=1 width=36) (actual time=0.009..0.025 rows=7 loops=1)
  Filter: (value ~~ '%life%'::text)
  Rows Removed by Filter: 59
Planning Time: 0.222 ms
Execution Time: 0.036 ms
```

To enforce index usage, disable sequential scan (`SET enable_seqscan=false;`) and rerun the query:

```
Bitmap Heap Scan on quotes  (cost=12.00..16.02 rows=1 width=36) (actual time=0.020..0.024 rows=7 loops=1)
  Recheck Cond: (value ~~ '%life%'::text)
  Rows Removed by Index Recheck: 7
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on quotes_idx  (cost=0.00..12.00 rows=1 width=0) (actual time=0.014..0.014 rows=14 loops=1)
        Index Cond: (value ~~ '%life%'::text)
Planning Time: 0.110 ms
Execution Time: 0.045 ms
```

## ts_vector and ts_query

`ts_vector` creates a list of tokens:

```sql
SELECT to_tsvector('The quick brown fox jumped over the lazy dog.');
```

```
                      to_tsvector
-------------------------------------------------------
 'brown':3 'dog':9 'fox':4 'jump':5 'lazi':8 'quick':2
```

`ts_query` queries the vector of certain words or phrases:

```sql
SELECT to_tsvector('The quick brown fox jumped over the lazy dog') @@ to_tsquery('fox');
```

```
?column?
----------
 t
```

`ts_vector` can also be used to create an index:

```sql
CREATE INDEX quotes_tsvector_idx ON quotes USING GIN (to_tsvector('english', value));
```

Such index can be used later in search to improve the query performance:

```sql
EXPLAIN ANALYZE SELECT value FROM quotes
WHERE to_tsvector('english', value) @@ to_tsquery('life');
```

```
Bitmap Heap Scan on quotes  (cost=8.25..12.77 rows=1 width=32) (actual time=0.017..0.018 rows=14 loops=1)
  Recheck Cond: (to_tsvector('english'::regconfig, value) @@ to_tsquery('life'::text))
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on quotes_tsvector_idx  (cost=0.00..8.25 rows=1 width=0) (actual time=0.013..0.013 rows=14 loops=1)
        Index Cond: (to_tsvector('english'::regconfig, value) @@ to_tsquery('life'::text))
Planning Time: 0.161 ms
Execution Time: 0.036 ms
```

`tsquery` also supports multiple conditions, i.e. it can be used to search for 'people' or 'person':

```sql
SELECT * FROM quotes
WHERE to_tsvector('english', value) @@ to_tsquery('people | person');
```

```
Bitmap Heap Scan on quotes  (cost=12.26..16.77 rows=1 width=32) (actual time=0.023..0.024 rows=5 loops=1)
  Recheck Cond: (to_tsvector('english'::regconfig, value) @@ to_tsquery('people | person'::text))
  Heap Blocks: exact=1
  ->  Bitmap Index Scan on quotes_tsvector_idx  (cost=0.00..12.25 rows=1 width=0) (actual time=0.020..0.020 rows=5 loops=1)
        Index Cond: (to_tsvector('english'::regconfig, value) @@ to_tsquery('people | person'::text))
Planning Time: 0.122 ms
Execution Time: 0.047 ms
```

and performs better than multiple `LIKE` conditions:

```sql
EXPLAIN ANALYZE
SELECT * FROM quotes WHERE value LIKE '%people%' OR value LIKE '%person%';
```

```
Bitmap Heap Scan on quotes  (cost=40.00..44.02 rows=1 width=36) (actual time=0.027..0.029 rows=5 loops=1)
  Recheck Cond: ((value ~~ '%people%'::text) OR (value ~~ '%person%'::text))
  Heap Blocks: exact=1
  ->  BitmapOr  (cost=40.00..40.00 rows=1 width=0) (actual time=0.022..0.022 rows=0 loops=1)
        ->  Bitmap Index Scan on quotes_idx  (cost=0.00..20.00 rows=1 width=0) (actual time=0.014..0.014 rows=4 loops=1)
              Index Cond: (value ~~ '%people%'::text)
        ->  Bitmap Index Scan on quotes_idx  (cost=0.00..20.00 rows=1 width=0) (actual time=0.007..0.007 rows=1 loops=1)
              Index Cond: (value ~~ '%person%'::text)
Planning Time: 0.146 ms
Execution Time: 0.053 ms
```

Full examples can be found on [dbfidle](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=37582bbe061b93f30386e77d13478fdf){:target="_blank"}.
