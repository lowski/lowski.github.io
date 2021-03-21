---
layout: default
title: Change screenshots path for Gnome
date: 2021-03-21
parent: Unix
---

# Change screenshots path for Gnome

Gnome does not provide a setting to change the screenshot's path. Shell scripts and custom keyboard shortcuts are the easiest way to customize a file name and its location

## Custom screenshot scripts

Those three small scripts will print screen and save it under `${HOME}/Downloads/Screenshots` directory (customize
if needed):

**Make a screenshot of the whole screen**

```bash
#!/usr/bin/env bash
# $HOME/.bin/ss-full.sh

DATE=$(date +%Y-%m-%dT%H:%M:%S)

mkdir -p "${HOME}/Downloads/Screenshots"

gnome-screenshot -f "${HOME}/Downloads/Screenshots/${DATE}.png"
```

**Make a screenshot of selected area**

```bash
#!/usr/bin/env bash
# $HOME/.bin/ss-area.sh

DATE=$(date +%Y-%m-%dT%H:%M:%S)

mkdir -p "${HOME}/Downloads/Screenshots"

gnome-screenshot -a -f "${HOME}/Downloads/Screenshots/${DATE}.png"
```

**Make a screenshot of an active window**

```bash
#!/usr/bin/env bash
# $HOME/.bin/ss-win.sh

DATE=$(date +%Y-%m-%dT%H:%M:%S)

mkdir -p "${HOME}/Downloads/Screenshots"

gnome-screenshot -w -f "${HOME}/Downloads/Screenshots/${DATE}.png"
```

*`chmod +x` is required to make those files executable.*

## Assign scripts to shortcuts

Before assigning new print screen shortcuts, the existing ones must be removed from the keyboard settings:

![screenshot](/images/attachments/remove-gnome-keyboard-shortcut.png)

Then, new ones can be added:

1. Print active window (`Alt + Print`) - `sh -c '/home/user/.bin/ss-win.sh'`
2. Print selected area (`Shift + Print`) - `sh -c '/home/user/.bin/ss-area.sh'`
3. Print the whole screen (`Print`) - `sh -c '/home/user/.bin/ss-full.sh'`

![screenshot](/images/attachments/add-gnome-keyboard-shortcut.png)
