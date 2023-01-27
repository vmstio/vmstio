---
title: Infrastructure
description: Where the bits go, to and fro
tags:
  - servers
  - docs
  - infrastructure
  - digital ocean
  - redis
  - postgres
---

![Server Layout](https://cdn.vmst.io/docs/vmstio-simple-tall.png)

## Providers

| **Vendor** | **Service** |
|---|---|
| Digital Ocean | Managed Databases, Load Balancer Services, CDN/Object Store, Virtual Machines (Droplets) |
| DNSimple | Registrar, Nameservers & SSL Certificate (via Sectigo) |
| Backblaze | Database & Media Backups on B2 |
| Sendgrid | SMTP Relay |
| GitHub | Configuration Repository |
| Slack | Team Communications |

## Core Services

Our core service is the Mastodon platform located at [vmst.io](https://vmst.io). Digital Ocean is our primary hosting provider for this service.

### Mastodon Components

- Nginx Reverse Proxy
- Mastodon Web Service (Puma/Streaming)
- Mastodon Sidekiq Services
- PostgresSQL Database
- Redis Database/Cache
- Stunnel
- Elastic Search
- Object Store

### Code Purity

Our goal is to run the latest released version of the Mastodon experience as soon as it's available, with a goal of being live here within 48 hours of being published.
If there are security related updates we intend to take those on even quicker to protect our infrastructure, users and your data.

In order to do this we run **unmodified** versions of the Mastodon code found on [GitHub](https://github.com/mastodon/mastodon).
We do not run run any of the available Mastodon forks (such as Glitch, Hometown or Treehouse) or perform any other local modifications to the Mastodon stack, unless it is specifically required to run on our infrastructure.

Other than those changes necessary for the functionality of our system, we do not intend to modify or customize Mastodon code in any other way that changes the user experience.

## Flings

Outside of our core service we run a number of "Flings" such as:

- elk.vmst.io
- semaphore.vmst.io
- write.vmst.io
- matrix.vmst.io

When possible we will run these in a highly available way, behind our security systems and load balancers, on redundant backend nodes.

### Fling Components

Our flings leverage much of the existing core service infrastructure like the Nginx reverse proxies and Postgres. In addition we have the following specific to our Flings:

- Dedicated virtual machines for Fling applications
- MySQL Database

### Code Purity

Similar to our policy on our core services, we seek to run the latest released version of our Fling components from their upstream projects.
However in some cases we are contributing to the development of these projects, and from time to time may run modified versions to assist with this task.

Our activity level may vary from Fling to Fling with our contributions to the upstream project.

## Backups

We utilize Backblaze B2 as our backup provider.

### Database Backups

Posts made to vmst.io and write.vmst.io are stored in backend databases (Postgres and MySQL) with Redis used as a key value store and timeline cache for vmst.io.

- For the backup of Postgres we use `pg_dump` and `redis-cli` for Redis.
- The native `b2-cli` utility is then used to make a copy of those backups a Backblaze B2 bucket.
- This is done using some custom scripts that process each task and then fire off notifications to our backend Slack.
- Database backups are currently made daily.
- Database backups are retained for 14 days, currently.
- All backups are encrypted both in transit and at rest.

### Media/CDN Store Backups

- The CDN/media data is sync'd directly to Backblaze B2 via `rclone`.
- This is done using some custom scripts that process each task and then fire off notifications to our backend Slack.
- CDN backups currently run every 4 hours.
- Only the latest copy of CDN data is retained.
- All backups are encrypted both in transit and at rest.

### Configuration Backups

- All configuration files for core applications, documentation and flings are stored on GitHub with changes committed there before being applied to servers.
- Each VM tier has an updated snapshot on Digital Ocean for easy deployment to horizontally scale, or to replace failed systems quickly.