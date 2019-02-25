---
layout: default
title: Multiple versions on MacOS
date: 2018-12-04
parent: PostgreSQL
---

# Multiple versions on MacOS

It's possible to run multiple versions of PostgreSQL using excellent [Postgres.app](https://postgresapp.com). It's very good solution as long as you don't need older Postgres versions (`Postgres.app` allows to run up to 4 last major versions).

This is an alternative solution which allows to run older versions and easily switch between them.

Start with tapping `petere`'s `Homebrew` repo:

```
brew tap petere/postgresql
```

Now you can install multiple versions:

```
brew install postgresql-9.3
brew install postgresql-9.6
```

I recommend to install `postgresql-common` which provides special wrapper scripts for running managing the clusters.

## Usage

Before starting the database, you need to create a cluster:

```
pg_createcluster 9.6 main
```

where `9.6` is postgres version and `main` is the name of the cluster to use. After that you can use `psql` to connected to newly created cluster:

```
psql --cluster 9.6/main -d postgres
```

## Cheatsheet

- `pg_lsclusters` list all clusters
- `pg_dropcluster` remove a cluster
- `pg_ctlcluster 9.6 main start` start a cluster
- `pg_ctlcluster 9.6 main stop` stop a cluster
- `pg_ctlcluster 9.6 main status` check claster's status

NOTE: In all above examples `9.6` is a PostgreSQL version and `main` is the name of the cluster to use.
