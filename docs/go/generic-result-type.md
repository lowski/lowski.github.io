---
layout: default
title: Generic result type in Go2
date: 2020-11-22
parent: Go
---

# Generic result type in Go2

[Go2](https://blog.golang.org/generics-next-step){:target="_blank"} is going to support generics. Recently I decided to check how such generic, chainable result type (useful in sequential operation workflows) might look like.

Here is an example of the API I wanted to achieve:

```go
Start(func() (int, error) { return 6, nil }).
	Then(devide).
	Then(multiply).
	Then(increment)
```

If any of the steps from the process (`device`, `multiply`, `increment`) end with error, the transformation should stop and last error should be preserved.

Before defining the generic `Result` type, let's define `ResultError` first so errors from the `Result` struct can be nicely print via `json.MarshalIndent`:

*In all code snippets below, I use syntax compatible with [go2goplay](https://go2goplay.golang.org){:target="_blank"}*

```go
type ResultError struct {
	error
}

func (re ResultError) MarshalJSON() ([]byte, error) {
	return json.Marshal(re.Error())
}
```

Then generic `Result` type (with exportable fields so they can be marshaled with `json.MarshalIndent`) supporting `Then` method and `String` helper (for pretty prints):

```go
type Result[T any] struct {
	Value T
	Err   *ResultError
}

func (r Result[T]) String() string {
	s, _ := json.MarshalIndent(r, "", "  ")
	return string(s)
}

func (r Result[T]) Then(fn func(T) (T, error)) Result[T] {
	if r.Err != nil {
		return r
	}
	
 	v, err := fn(r.Value)
	if err != nil {
		return Result[T]{Err: &ResultError{err}}
	}
	return Result[T]{Value: v}
}
```

and the first step of the process / `Result` constructor might look as follows:

```go
func Start[T any](fn func() (T, error)) Result[T] {
	v, err := fn()
	if err != nil {
		return Result[T]{Err: &ResultError{err}}
	}
	return Result[T]{Value: v}
}
```

Consequently the whole operation might be written as:

```go
var r = Start(func() (int, error) { return 6, nil }).
		Then(devide).
		Then(multiply).
		Then(increment)
fmt.Println(r)
```

Full Example can be run [go2goplay](https://go2goplay.golang.org/p/UZ5K6OJbfSr){:target="_blank"}.
