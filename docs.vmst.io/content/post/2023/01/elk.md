---
author: Michael Stanclift
title: Elk
date: '2023-01-13'
description: Alternative web frontend
tags:
  - elk
  - fling
---

Elk is an [open source project](https://github.com/elk-zone/elk) to build an alternative web frontend for Mastodon.
It's in very active development, but is considered "alpha" by their team.

I have decided to stand up an instance of Elk at [elk.vmst.io](https://elk.vmst.io) for our users to play with.
(You don't technically have to be a vmst.io member to use it.)

A few disclaimers:
- I consider this (to grab a VMware term) a "Fling" and not part of our core services offering, at least for the time being.
- I'm running straight from the dev branch, and roughly every three hours will automatically pull in updates, recompile and restart the service.
- This is not behind our primary load balancer, so when I bounce the service for updates, it just won't work, but come back in a few minutes and it'll probably be fine.
- There are no SLAs or anything fancy around this, but I am monitoring uptime on [status.vmst.io](https://status.vmst.io).
- If it breaks, it could be me or it could be the upstream developers. While you're free to let me know directly if there are issues as it relates to availability, if it's a bug in the product or something you'd like done differently please leave a comment on their [GitHub](https://github.com/elk-zone/elk).
- This is not and will never be a replacement for the main web interface on [vmst.io](https://vmst.io), it's just a fun option for folks to use and help test.

Lastly, the ability to do these things is funded by our members, so if you'd like me to be able to stand up additional "Flings" for other tools or platforms please visit our [Funding](https://docs.vmst.io/funding) page and sign up to be a monthly contributor.