---
title: Backups
---

# Backups

We backup the persistent data storage of vmst.io multiple times per day/week and to different locations.

## Database Backups

Posts made to [vmst.io](https://vmst.io) and messages sent via Matrix are stored in backend Postgres databases with Redis used as a key value store and timeline cache for [vmst.io](https://vmst.io).

- For the backup of PostgreSQL we use `pg_dump` with some custom scripts that process each task and then fire off notifications to our backend Matrix channels.
- Database backups are currently made every four hours, and replicated across geographies.

## Media/CDN Store Backups

- The CDN/media data is sync'd directly to another Digital Ocean object store via the `rclone` [utility](https://rclone.org).
- This is done using some custom scripts that process each task and then fire off notifications to our backend Matrix channels.
- CDN backups currently run every two days.
- Only the latest copy of CDN data is retained.

## Configuration Backups

- All configuration files for core applications, documentation and Flings are stored on GitHub with changes committed there before being applied to servers.
- Each virtual machine tier has an updated snapshot on Digital Ocean for easy deployment to horizontally scale, or to replace failed systems quickly.
