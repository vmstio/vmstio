---
title: Source Code
---

# Source Code

Our goal is to provide the best possible Mastodon experience for our members.
One way to deliver on that is by delivering the most up-to-date Mastodon code.
We  "run off main", which means using the latest commits to the `main` branch of the Mastodon codebase found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository.

We take a clean copy of the latest Mastodon code and then apply a limited set of modification with a custom script.
We then build the modified code inside a Docker container, publish it to GitHub and Docker Hub, for consumption by our Kubernetes cluster.

Mastodon instance specific customizations include:

- Customizing the Mastodon logo, if needed, for events like Pride Month
- Removing the Hiredis driver (see below)
- Raising the post character count limit from 500 to 512
- Changing the icon used for "Unlisted" posts
- Making images in the timeline views draggable
- Adding the GitHub commit to the [version information](/infrastructure/versions)
- Adding the [Elephant](/flings/elephant) theme

Container specific build settings include:

- Embedding the Digital Ocean internal security certificates for use by the the Streaming service to connect to their managed Postgres database
- Using Docker 12 "Bookworm" with the latest package updates as our container base operating system
- Using deb-multimedia for getting the latest versions of packages like ImageMagick 7 and ffmpeg 6
- Using node.js 18.x instead of 16.x, obtained via Node Source
- Enabling [YJIT](https://shopify.engineering/ruby-yjit-is-production-ready) for better Ruby performance

## Container Availability

Our customized container image is available from both Docker and GitHub container registries.

- [GitHub](https://github.com/users/vmstan/packages/container/package/mastodon)
- [Docker](https://hub.docker.com/r/vmstan/mastodon)

Be aware, there are currently hardcoded links to the vmst.io [Funding](/funding) page in the sidebar, should you implement this for yourself.

## Redis TLS Changes

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
