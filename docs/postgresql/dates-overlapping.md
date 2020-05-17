---
layout: default
title: Dates overlapping with PostgreSQL
date: 2020-05-17
parent: PostgreSQL
---

# Dates overlapping with PostgreSQL

PostgreSQL supports checking if date ranges overlaps with each other (i.e. useful in reservation systems to check if 2 request do not conflict).

It can be used with:

- dates:

    ```sql
    SELECT *
    FROM bookings
    WHERE (date_start, date_finish) OVERLAPS (DATE '2018-07-12 06:30:00', DATE '2018-07-12 06:40:00');
    ```

- intervals:

    ```sql
    SELECT *
    FROM bookings
    (date, INTERVAL '1 sec' * duration) OVERLAPS (DATE '2018-07-12 06:30:00', DATE '2018-07-12 06:40:00');
    ```
