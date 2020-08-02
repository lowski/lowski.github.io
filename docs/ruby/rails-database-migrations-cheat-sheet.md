---
layout: default
title: Rails database migrations cheat-sheet
date: 2020-08-03
parent: Ruby
---

# Rails database migrations cheat-sheet

**Get status of migrations**

```
rake db:migrate:status
```

**Revert all migrations to a specific version**

```
rake db:migrate VERSION=20100905201547
```

**Revert specific migration**

```
rake db:migrate:down VERSION=20100905201547
```

or  in multi database setup:

```
rake db:migrate:down:primary VERSION=20100905201547
```

**Revert latest `n` migrations**

```
rake db:rollback STEP={n}
```

**Run a specific migration**

```
rake db:migrate:up VERSION=20100905201547
```

or in multi database setup:

```
rake db:migrate:up:primary VERSION=20100905201547
```
