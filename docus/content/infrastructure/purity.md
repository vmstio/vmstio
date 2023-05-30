---
title: Code Purity
---

# Code Purity

Our goal is to run the latest released version of the Mastodon experience within 48 hours of being published.
Previously this meant only deploying the finalized, tagged, releases.
As of May 2023, we're deploying the latest and greatest code on a regular basis through an automation pipeline.

![About Version](/about.png)

::alert{type="info"}
In this example, vmst.io is running the base version of 4.1.2 plus all of the merged code changes to main since then, up until commit [5811ccc61](https://github.com/mastodon/mastodon/commit/5811ccc6117ed3a506c0b4e36acda5cd42315a7d).
::

In order to help facilitate this, we run the stock version of the Mastodon code found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository with only limited modification necessary to run on our infrastructure.

We do not run any of the available Mastodon forks (such as [Glitch](https://glitch-soc.github.io/docs/) or [Hometown](https://github.com/hometown-fork/hometown)) or perform any other local modifications to the Mastodon stack unless it's required to properly interact with our systems.
We do not intend to modify or customize Mastodon code in any other way that changes the default user experience.

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
