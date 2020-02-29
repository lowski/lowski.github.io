---
layout: default
title: Padding numbers with zeros in Ruby
date: 2020-02-29
parent: Ruby
---

# Padding numbers with zeros in Ruby

`String#%` method allows to specify format that should be applied to its argument. It can be used to pad numbers with zeros.

## Leading zeros

```
> "%03d" % 2
=> "002"
```

## Trailing zeros

```
> "%.2f" % 2
=> "2.00"
```
