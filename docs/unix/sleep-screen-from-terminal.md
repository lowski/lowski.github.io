---
layout: default
title: Sleep screen from terminal on Linux
date: 2020-09-27
parent: Unix
---

# Sleep screen from terminal on Linux

To turn off screen immediately use:

```
xset dpms force off
```

where:

- `xset` is a user preference utility for X
- `dpms` manages power saving behaviour of monitors when the computer is not in use

More info on `DPMS` can be found on excellent [Arch wiki](https://wiki.archlinux.org/index.php/Display_Power_Management_Signaling){:target="_blank"}.

**elementary OS hint**

On elementary OS, screen might get turned on after a few seconds with login prompt. To disable it, turn off "Lock after screen turns off" in the `Security & Privacy` -> `Locking` preferences.
