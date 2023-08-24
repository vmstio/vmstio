---
title: Code Purity
---

# Code Purity

Our goal is to provide the best possible Mastodon experience for our members.
One way to deliver on that is by delivering the most up-to-date Mastodon code. 
We are always "running off main" -- meaning using the latest commits to the Mastodon codebase found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository, and then at the application build time, applying a limited modification set.

## +io

Such instance specific customizations include:

- Embedding the Digital Ocean internal security certificates
- Customizing the Mastodon logo, if needed, for events like Pride Month
- Removing the Hiredis driver (see below)
- Updating our Docker containers to Debian 12 (Bookworm)
- Updating to ImageMagick 7 and ffmpeg 6
- Raising the post character count limit from 500 to 512
- Adding the [Elephant](/flings/elephant) theme
- Displaying the commit level that our custom build is running.

## Container Availability

Our customized container image is available from both Docker and GitHub container registries.

- [GitHub](https://github.com/users/vmstan/packages/container/package/mastodon)
- [Docker](https://hub.docker.com/r/vmstan/mastodon)

Be aware, there are currently hardcoded links to the vmst.io [Funding](/funding) page in the sidebar, should you implement this for yourself.

## Version Information

Starting with Mastodon 4.2, the project is standardizing use the use of `dev`, `nightly`, `beta` and `rc` sub-releases.

- `dev` is used to identify instances running directly from the `main` branch on GitHub, either compiled from source directly or using their own container images. The `.0` can be incremented should there be a critical security issue fix and applied to the `main` branch.
- `nightly` is used to identify instances running typically from the project compiled container images which are automatically published with the current status of `main` every night.
- `beta` or `rc` will identify instances running from a soon to be finalized release of Mastodon, from a tagged pre-released on GitHub or from a project compiled container image.

Forks of local code modifications are indicated by the `+text` at the end of the version string.

Once 4.2 has been released, instances which are running a non-standard version of Mastodon through any of the methods described above, will increment to the next major version, likely 4.3. (Ex: `4.3.0-nightly.2023-11-09`)

Version information is visible in the lower left corner of the web interface on desktop, or at the bottom of the [About](https://vmst.io/about) page on mobile.

![About Version](/about.png)

In the image example, vmst.io is running `4.2.0-dev.0` version of Mastodon as it exists in the `main` branch on GitHub, at commit [9a8190d](https://github.com/mastodon/mastodon/commit/9a8190da4a7a5bd74df36ae076573e014b254ef0), plus minimal local changes specific to vmst.io as noted by `+io`.

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