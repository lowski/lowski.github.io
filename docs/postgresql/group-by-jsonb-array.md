---
layout: default
title: Group by JSONB array in PostgreSQL
date: 2020-02-16
parent: PostgreSQL
---

# Group by JSONB array in PostgreSQL

Recently, [Nate Berkopec](https://twitter.com/nateberkopec){:target="_blank"} has been running an online webinar about profiling Rails applications. During the workshop, he was investigating the performance of a platform to recommend Spotify artists based on a listing history. PostgreSQL database was storing artists' genres in an array structure using JSONB field.

An interesting case appeared in the middle of the session when Nate wanted to optimize a Ruby code to find the most popular genres based on the number of artists associated with them. As it turned out, it's possible to delegate such a query to the database for better performance.

Let's start with a schema definition and some sample data to play with:

```sql
CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name TEXT,
  genres jsonb
);
```

| id | name         | genres                            |
|====|==============|===================================|
| 1  | Kraftwerk    | ["electronic"]                    |
| 2  | Daft Punk    | ["electronic", "house"]           |
| 3  | Maroon 5     | ["pop", "rock"]                   |
| 4  | One Republic | ["pop", "rock"]                   |
| 5  | Lil Nas X    | ["hip-hop", "country rap", "rap"] |
| 6  | Post Malone  | ["hip-hop", "rap", "trap"]        |
| 7  | Drake        | ["hip-hop", "rap"]                |

To extract genres out of `artists` table, [jsonb_array_elements](https://www.postgresql.org/docs/9.5/functions-json.html){:target="blank"} function can be used:

```sql
SELECT jsonb_array_elements(artists.genres) AS genre
FROM artists;
```

| genre         |
|===============|
| "electronic"  |
| "electronic"  |
| "house"       |
| "pop"         |
| "rock"        |
| "pop"         |
| "rock"        |
| "hip-hop"     |
| "country rap" |
| "rap"         |
| "hip-hop"     |
| "rap"         |
| "trap"        |
| "hip-hop"     |
| "rap"         |

Then the only part that left is to group, count and sort:

```sql
SELECT jsonb_array_elements(a.genres) AS genre, COUNT(1) AS popularity
FROM artists AS a
GROUP BY genre
ORDER BY popularity DESC;
```

Which gives the most popular genres:

| genre         | count |
|===============|=======|
| "rap"         | 3     |
| "hip-hop"     | 3     |
| "pop"         | 2     |
| "rock"        | 2     |
| "electronic"  | 2     |
| "house"       | 1     |
| "country rap" | 1     |
| "trap"        | 1     |

Full example can be found on [dbfidle](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=4134db3684c727d4fa7f00482e870c03){:target="_blank"}.
