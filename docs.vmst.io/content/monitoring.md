---
title: Monitoring
description: Who watches the watchers?
aliases:
  - status
  - monitor
  - stats
  - metrics
category:
  - docs
---

## [status.vmst.io](https://status.vmst.io/)

This is our external monitoring powered by Uptime Kuma. It runs from a virtual server in a different cloud (Linode) than where our production systems run (Digital Ocean). It monitors the status of:

- Mastodon (vmst.io)
- Object Store (cdn.vmst.io)
- This Site (docs.vmst.io)
- Redis Cache
- Redis Database
- PostgreSQL Database
- Elastic Search
- Grafana

Uptime is calculated for the last 24 hours.

Check the [status page](https://status.vmst.io/) for known outages or maintenance reports.

## Community Monitoring

- [FediDB Entry](https://fedidb.org/network/instance?domain=vmst.io)
