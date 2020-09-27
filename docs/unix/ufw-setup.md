---
layout: default
title: UFW setup
date: 2020-04-26
parent: Unix
---

# UFW setup

[UncomplicatedFirewall](https://wiki.ubuntu.com/UncomplicatedFirewall){:target="_blank"} is an interface to iptables to simplify the process of configuring a firewall on Linux systems.

## Quick start

1. Check firewall status:
```shell
sudo ufw status verbose
```
2. Disable incoming traffic and enable outgoing
```shell
sudo ufw default deny incoming
sudo ufw default allow outgoing
```
3. Allow usual connections
```shell
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```
4. Enable firewall
```
sudo ufw enable
```

## Extra customizations

To allow specific port ranges:
```shell
sudo ufw allow 6000:6007/tcp
sudo ufw allow 6000:6007/udp
```

To allow specific IP Addresses:
```shell
sudo ufw allow from 15.15.15.51
sudo ufw allow from 15.15.15.51 to any port 22
```
