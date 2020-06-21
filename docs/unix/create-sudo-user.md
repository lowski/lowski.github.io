---
layout: default
title: Create sudo user on Linux
date: 2020-06-21
parent: Unix
---

# Create sudo user on Linux

Before provisioning any Linux server, usually some kind of admin user is needed to perform the initial setup (i.e. with Ansible)

To create a sudo user:

1. Connect to VPS `ssh root@server_ip_address`
2. Create a new user: `adduser username --force-badname` (`--force-badname` flag will raise an error if your name contains forbidden or problematic characters)
3. Add new user to the `admin` group: `adduser username admin`
4. Modify `sudoers` file (with `visudo`, to prevent saving incorrect file) so users of `sudo` and `admin` groups can login without password:

    ```
    # Members of the admin group may gain root privileges
    %admin ALL=(ALL) NOPASSWD:ALL

    # Allow members of group sudo to execute any command
    %sudo   ALL=(ALL:ALL) NOPASSWD:ALL
    ```

5. Add your SSH key to authorized keys:

    1. `sudo su - username`
    2. `mkdir ~/.ssh`
    3. `chmod 700 ~/.ssh`
    4. `touch ~/.ssh/authorized_keys`
    5. `chmod 644 ~/.ssh/authorized_keys`
    6. `vim ~/.ssh/authorized_keys`

6. Logout and login as a new user to test the setup
