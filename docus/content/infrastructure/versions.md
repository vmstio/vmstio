---
title: Versions
---

# Versions

The overwhelming majority of Mastodon instances are running the standard "tagged" releases from the Mastodon project, and look something like `v4.1.6`, but as explained before we do things a little different here.

## Pre-releases

Starting with Mastodon 4.2, the project is standardizing the use of `dev`, `nightly`, `beta` and `rc` pre-releases.

- `dev.X` is used to identify instances running directly from the `main` branch on GitHub, either compiled from source directly or using their own container images.
- `nightly` is used to identify instances running typically from the project compiled container images which are automatically published with the current status of `main` every night.
- `betaX` or `rcX` will identify instances running from a soon to be finalized release of Mastodon, from a tagged pre-release on GitHub or from a project compiled container image.

Additional "metadata" about the release can be added after the pre-release flag, such as a GitHub commit or PR. (Ex: `v4.2.0-beta2+pr-41231`)

![Mastodon Branches](/mastodon-main.png)

## Forks & Metadata

Forks or other local code modifications are indicated by additional `+text` at the end of the version string.
One popular soft-fork of Mastodon, called [Glitch](https://glitch-soc.github.io/docs/), is typically identified by `+glitch` at the end of the version.
We use `+io` for our minor deployment changes, which is **not** published as a fork.

Once 4.2 has been released, instances which are running a non-tagged release version of Mastodon through any of the methods described above, will increment to the next major version, likely 4.3. (Ex: `v4.3.0-nightly.2023-11-09` is the nightly format which would commonly be seen on instances like [mastodon.social](https://mastodon.social))

## Our Versions

Version information is visible in the lower left corner of the web interface on desktop, or at the bottom of the [About](https://vmst.io/about) page on mobile.

![About Version](/about.png)

In the image example, vmst.io is running the `4.2.0-beta2` version of Mastodon, plus all of the commits to the `main` branch on GitHub at to [7164176](https://github.com/mastodon/mastodon/commit/71641766f2ca6555fe19b309e9bd9f2455575bcc) (represented by the first seven characters of the hash), plus minimal local changes specific to vmst.io as noted by `+io`.

Once Mastodon 4.2 is officially released, and work starts on the next minor.major release, our version will increment to something like `v4.3.0-dev.0+git-githash+io` automatically.