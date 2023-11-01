---
title: Backups
---

# Backups

We backup the persistent data storage of vmst.io multiple times per day/week and to different locations.

## Database Backups

Posts made to [vmst.io](https://vmst.io) are stored in backend Postgres databases with Redis used as a key value store and timeline cache.

- For the backup of PostgreSQL we use `pg_dump` with some custom scripts that process each task and then fire off notifications to our backend Slack channels.
- Database backups are currently made every day, and replicated twice, across geographies.
- In addition, Digital Ocean provides transaction level rollback functionality as part of their managed database service.

## Media/CDN Store Backups

- The CDN/media data is sync'd directly to another Digital Ocean object store via the `rclone` [utility](https://rclone.org).
- This is done using some custom scripts that process each task and then fire off notifications to our backend Slack channels.
- CDN backups currently run every day.
- Only the latest copy of CDN data is retained.

## Configuration Backups

- All configuration files for core applications, documentation and web clients are stored on GitHub with changes committed there before being applied to servers.

## Backup Image

We have a customized container image available from both Docker and GitHub container registries used for backup purposes.
This image is designed for backup, replication and maintenance of container based Mastodon implementations.
It includes rclone, Postgres and Redis utilities.

- The version tags for the image represent the version of rclone used.
- The image is based on Debian 11.
- Postgres utilities are based on version 15.
- Redis utilities are based on version 7.

There are `/root/backups` and `/root/scripts` directories suitable for mounting and processing relevant files.

In order to use rclone you'll need to mount an existing `rclone.conf` file to `/root/.config/rclone/rclone.conf`

- [GitHub](https://github.com/users/vmstan/packages/container/package/rclone)
- [Docker](https://hub.docker.com/r/vmstan/rclone)