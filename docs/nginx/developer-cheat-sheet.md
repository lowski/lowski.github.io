---
layout: default
title: Nginx - developer cheat sheet
date: 2020-03-15
parent: Nginx
---

# Nginx - developer cheat sheet

## Installation (MacOS)

Nginx can be easily installed on OS X using [Homebrew](https://brew.sh):

```
brew install nginx
```

With [homebrew-services](https://github.com/Homebrew/homebrew-services) it can be easily started with:

```
brew services start nginx
```

## Adding virtual hosts

By default, all files inside `/usr/local/etc/nginx/servers/` directory are automatically included. To add a new domain, simply create a new file there with content like this:

```
server {
  listen 8080;
  server_name myapp.test;
  access_log /usr/local/var/log/nginx/myapp.access.log;

  location / {
    proxy_pass  http://127.0.0.1:3000;
  }
}
```

### Generating virtual hosts on demand

To generate a virtual host on demand (i.e. to run with `foreman` or `heroku local`) a following script can be helpful:

```ruby
#!/usr/bin/env ruby

require 'erb'

class Proxy
  NGINX_CONFIG_PATH = '/usr/local/etc/nginx/servers/'

  def initialize(hostname, port = nil)
    @hostname = hostname
    @port = port
  end

  def create!
    File.open(config_path, 'w+') do |io|
      config = ERB.new(config_template).result(binding)
      io.write(config)
    end

    reload!
  end

  def destroy!
    return unless File.exist?(config_path)

    File.unlink(config_path)
    reload!
  end

  private

  attr_reader :hostname, :port

  def config_path
    File.join(NGINX_CONFIG_PATH, "#{hostname}.conf")
  end

  def config_template
    <<~EOT
      server {
        listen 8080;
        server_name <%= hostname %>;
        access_log /usr/local/var/log/nginx/<%= hostname %>.access.log;

        location / {
          proxy_pass  http://127.0.0.1:<%= port %>;
        }
      }
    EOT
  end

  def reload!
    `brew services restart nginx`
  end
end

case ARGV[0]
when 'up'
  hostname = ARGV[1]
  port = ARGV[2]
  puts "Creating proxy for #{hostname} under 127.0.0.1:#{port}"
  Proxy.new(hostname, port).create!
when 'down'
  hostname = ARGV[1]
  puts "Destroying proxy for #{hostname}"
  Proxy.new(hostname).destroy!
else
  raise ArgumentError, "Proxy: #{ARGV[0]} is not supported"
end
```

Assuming the script is saved under `proxy.sh`, it can be used in a `Procfile` like this:

```yaml
web: proxy.sh up your-app.dev $PORT && bundle exec rails s -p $PORT && proxy.sh down your-app.dev
```
