---
title: Versions
---

# Versions

The overwhelming majority of Mastodon instances are running the standard "tagged" releases from the Mastodon project, and look something like `v4.1.6`, but as explained before we do things a little different here.

Mastodon, like most [Ruby](https://www.ruby-lang.org/en/) programs, use something called "semver" or [Semantic Versioning] to represent it's version number.
This is represented as `vMAJOR.MINOR.PATCH` such as with Mastodon `v4.1.6` as mentioned above.

Mastodon uses [GitHub](https://github.com/mastodon/mastodon) as its source code repository.
Developers from all around the world work on modifying and improving the code.
All of the reviewed and approve Mastodon code in GitHub is stored in what is referred to as the _main branch_.

Using `git`, anyone can _fork_ the main Mastodon code, make changes to their fork, and then submit those changes back to the project.
The process of submitting those changes is called a _pull request_.
Once a pull request has been approved by the project team, it's _merged_ back into the main branch.

Once the project team has determined that all of the features they want to include in a new MAJOR.MINOR version of Mastodon is ready for public consumption, the current status of the main branch is tagged, and starts its own stable/release branch.
For instance, when Mastodon 4.1.0 was released, there was a new branch called `stable-4-1` that was created.

Work then begins on Mastodon 4.2.0, with pull requests being merged into `main` and as bugs are found and fixed that impact previous stable releases, those changes are also merged into the other supported stable branches, and then tagged for release as `v4.1.1`, `v3.5.7`, etc.

In order to get new features, Mastodon administrators must upgrade to the next `vMAJOR.MINOR` release.

![Mastodon Branches](/mastodon-branches.png)

## Pre-releases

Some Mastodon instances, including vmst.io, run pre-release versions of Mastodon to get quicker access to new features as well as to help with testing before they're released to the community for administrators who want to only run stable releases.
Our users feedback helps shape the Mastodon product for everyone!

Starting with Mastodon 4.2, the project is standardizing the use of `dev`, `nightly`, `beta` and `rc` pre-releases.

- `dev.X` is used to identify instances running directly from the `main` branch on GitHub, either compiled from source directly or using their own container images.
- `nightly` is used to identify instances running typically from the project compiled container images which are automatically published with the current status of `main` every night.
- `betaX` or `rcX` will identify instances running from a soon to be finalized release of Mastodon, from a tagged pre-release on GitHub or from a project compiled container image.

Instances which run on `dev.X` or `nightly` are typically running the latest code available when it went into production, and not waiting for an official release.

Additional "metadata" about the release can be added after the pre-release flag, such as a GitHub commit or PR. (Ex: `v4.2.0-beta2+pr-41231`)

## Forks & Metadata

Forks or other local code modifications are indicated by additional `+text` at the end of the version string.
One popular soft-fork of Mastodon, called [Glitch](https://glitch-soc.github.io/docs/), is typically identified by `+glitch` at the end of the version.
We use `+io` for our minor deployment changes.

Once 4.2 has been released, instances which are running a non-tagged release version of Mastodon through any of the methods described above, will increment to the next major version, likely 4.3. (Ex: `v4.3.0-nightly.2023-11-09` is the nightly format which would commonly be seen on instances like [mastodon.social](https://mastodon.social))

## Our Versions

Version information is visible in the lower left corner of the web interface on desktop, or at the bottom of the [About](https://vmst.io/about) page on mobile.

![About Version](/about.png)

In the image example, vmst.io is running the `4.2.0-dev.0` version of Mastodon, which the `dev.0` indicates it was being built from the `main` branch on GitHub, at commit [ecd76fa](https://github.com/mastodon/mastodon/commit/ecd76fa413e31d4eb26e09fa4b65f8b13bbbb0b7) (represented by the first seven characters of the hash), plus minimal local changes specific to vmst.io as noted by `+io`.

Once Mastodon 4.2 is officially released, and work starts on the next minor.major release, our version will increment to something like `v4.3.0-dev.0+io` automatically.
Our [custom Mastodon build](/infrastructure/source) includes the commit ID as part of the about page display code but not in actual the version string.
