---
title: Code Purity
---

# Code Purity

Our goal is to run the latest released version of the Mastodon experience within 48 hours of being published.
Previously this meant only deploying the finalized, tagged, releases.
As of May 2023, we're deploying the latest and greatest code on a regular basis through an automation pipeline.

![About Version](/about.png)

::alert{type="info"}
In this example, vmst.io is running the pre-released (4.2.0) version of Mastodon as it exists in the `main` branch on GitHub, at commit [dab54cc](https://github.com/mastodon/mastodon/commit/dab54ccbba3721382241725bb1c1159d24b5aab2), plus minimal local changes specific to vmst.io as noted below.
::

In order to help facilitate this, we run the stock version of the Mastodon code found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository and then at the application build time, apply a limited modification set.

- Embed the Digital Ocean internal security certificates
- Customize the Mastodon logo, if needed, for events like Pride Month
- Removal of the Hiredis driver (see below)
- Updating our Docker containers to Debian 12 (Bookworm)
- Updating to ImageMagick 7 and ffmpeg 6
- Raising the post character count limit from 500 to 512
- Adding the [Bird UI](/flings/birdui) theme

We do not run any of the available Mastodon forks (such as [Glitch](https://glitch-soc.github.io/docs/) or [Hometown](https://github.com/hometown-fork/hometown)).

## TLS

Digital Ocean requires encrypted/TLS connections to their managed Redis instances, however the Mastodon codebase uses a Redis driver ([hiredis](https://github.com/redis/hiredis-rb)) which does not have a native TLS capability.
To accommodate this, we have in the past used [HAProxy](https://www.haproxy.org) or [Stunnel](https://www.stunnel.org) to take the un-encrypted connection requests and encrypt those connections between the Mastodon components and Redis.

We have chosen to remove the hiredis driver from our installation and use redis-rb instead.
Using the native redis-rb driver provides support for TLS connections.
This is done by patching a stock Mastodon installation with the following commands, downloading updated bundles and node components, and recompiling:

```bash
sed -i '/gem '\''hiredis'\'', '\''~> 0.6'\''/d' ./Gemfile
sed -i '/hiredis/d' ./Gemfile.lock
sed -i '/hiredis/d' ./lib/mastodon/redis_config.rb
sed -i '/hiredis/d' ./lib/tasks/mastodon.rake
sed -i 's/, driver: :hiredis//g' ./app/lib/redis_configuration.rb
sed -i 's/, require: \['\''redis'\'', '\''redis\/connection\/hiredis'\''\]//' ./Gemfile
```

Compared to running with hiredis through HAProxy or Stunnel, we have not seen any negative impact in performance by using redis-rb.
