---
layout: default
title: Benchmarking Ruby code
date: 2020-08-29
parent: Ruby
---

# Benchmarking Ruby code

When comparing performance between different codes, usually it boils down to: 

1. How fast it is
2. How much memory it uses (how many objects are being allocated)

## Measuring execution time

Ruby's standard library includes [Benchmark module](https://ruby-doc.org/stdlib-2.7.1/libdoc/benchmark/rdoc/Benchmark.html){:target="_blank"} that can be used to report a time to execute a particular peace of code.

The most basic way to use it is through a `Benchmark.measure` method:

```ruby
require 'benchmark'

result = Benchmark.measure do
  100.times.map { |i| i.to_s }
end
puts result
```

```
0.000027   0.000007   0.000034 (  0.000030)
```

The module also provides `Benchmark.bm` function for a comparison between different code blocks (btw. if you check the above code with [Rubocop](https://rubocop.org){:target="_blank"}, it will suggest using `Array.new` with a block instead of using `n.times.map` so let's compare them):

```ruby
require 'benchmark'

Benchmark.bm do |x|
  x.report do
    100.times.map { |i| i.to_s }
  end
  x.report do
    Array.new(100) { |i| i.to_s }
  end
end
```

```
    user     system      total        real
0.000023   0.000004   0.000027 (  0.000023)
0.000015   0.000001   0.000016 (  0.000014)
```

For more detailed output, [benchmark-ips gem](https://rubygems.org/gems/benchmark-ips){:target="_blank"} might be used:

```ruby
require 'benchmark/ips'

Benchmark.ips do |x|
  x.report('times.map') do
    100.times.map { |i| i.to_s }
  end
  x.report('Array.new') do
    Array.new(100) { |i| i.to_s }
  end
  x.compare!
end
```

It's now crystal clear that `Rubocop` was right:

```
Warming up --------------------------------------
           times.map     6.795k i/100ms
           Array.new     7.964k i/100ms
Calculating -------------------------------------
           times.map     67.666k (± 1.9%) i/s -    339.750k in   5.022865s
           Array.new     78.996k (± 1.5%) i/s -    398.200k in   5.041971s

Comparison:
           Array.new:    78995.6 i/s
           times.map:    67666.2 i/s - 1.17x  (± 0.00) slower
```

## Measure memory and object allocations

For calculating memory and object allocations, [memory_profiler gem](https://github.com/SamSaffron/memory_profiler){:target="_blank"} is one of the most popular options:

```ruby
require 'memory_profiler'

result = MemoryProfiler.report do
  Array.new(5) { |i| i.to_s }
end
result.pretty_print
```

```
Total allocated: 280 bytes (6 objects)
Total retained:  0 bytes (0 objects)

allocated memory by gem
-----------------------------------
       280  other

allocated memory by file
-----------------------------------
       280  benchmark.rb

allocated memory by location
-----------------------------------
       280  benchmark.rb:7

allocated memory by class
-----------------------------------
       200  String
        80  Array

allocated objects by gem
-----------------------------------
         6  other

allocated objects by file
-----------------------------------
         6  benchmark.rb

allocated objects by location
-----------------------------------
         6  benchmark.rb:7

allocated objects by class
-----------------------------------
         5  String
         1  Array

retained memory by gem
-----------------------------------
NO DATA

retained memory by file
-----------------------------------
NO DATA

retained memory by location
-----------------------------------
NO DATA

retained memory by class
-----------------------------------
NO DATA

retained objects by gem
-----------------------------------
NO DATA

retained objects by file
-----------------------------------
NO DATA

retained objects by location
-----------------------------------
NO DATA

retained objects by class
-----------------------------------
NO DATA


Allocated String Report
-----------------------------------
         1  "0"
         1  benchmark.rb:7

         1  "1"
         1  benchmark.rb:7

         1  "2"
         1  benchmark.rb:7

         1  "3"
         1  benchmark.rb:7

         1  "4"
         1  benchmark.rb:7
```
