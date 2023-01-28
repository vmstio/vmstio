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
- Translation API
- Object Store
- SMTP

### Code Purity

Our goal is to run the latest released version of the Mastodon experience as soon as it's available, with a goal of being live here within 48 hours of being published.
If there are security related updates we intend to take those on even quicker to protect our infrastructure, users and your data.

In order to do this we run **unmodified** versions of the Mastodon code found on [GitHub](https://github.com/mastodon/mastodon).
We do not run any of the available Mastodon forks (such as Glitch, Hometown or Treehouse) or perform any other local modifications to the Mastodon stack, unless it is specifically required to run on our infrastructure.

Other than those changes necessary for the functionality of our system, we do not intend to modify or customize Mastodon code in any other way that changes the user experience.

### Virtual Machines

We use Digital Ocean "Droplets" with Debian 11 as the base operating system for our self-managed virtual machines.

### Load Balancing 

We use the Digital Ocean managed load balancer objects to distribute user traffic across our frontend reverse proxies.

### Reverse Proxies

We use Nginx as our reverse proxy software running on dedicated nodes.
The Nginx tier provides TLS/SSL termination for both the core Mastodon service and any of our Flings.
We use the upstream stable Nginx repos.

### Mastodon Web

The Mastodon Web tier consists of the Core Mastodon experience which is a Ruby application with Puma as the web/presentation service, and a Streaming API which is a node.js application.
We use the Ruby and node.js versions which are recommended in the documentation for installing Mastodon from source on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/install/).

### Persistence

The persistent data in the Mastodon environment are represented by user posts which are stored in a PostgreSQL database, and user media attachments which are stored in an S3-compatible object store.

#### Postgres

We use the Digital Ocean managed database service, this delivers a highly available database backend.

#### Object Store

We use the Digital Ocean managed object store (Spaces), which includes a content delivery network (CDN) to distribute uesr uploaded media around the world to reduce latency for users.

### Redis

We use the Digital Ocean managed database service, this delivers a highly available database backend.

#### Stunnel

Digital Ocean requires encrypted/TLS connections to their managed Redis instances, however the Mastodon codebase includes a Redis library which does not have a native TLS capability.
Stunnel is used as a proxy to take the un-encrypted connection requests and encrypt those connections between the client and Redis.
This process is used on our Mastodon Web and Sidekiq nodes.

### Sidekiq

Sidekiq is an essential part of the Mastodon environment and delivered as part of the Mastodon code.
Everything that happens when you interact with Mastodon and the wider Fediverse through our instance, has to pass through Sidekiq.
It communicates with Redis, Postgres, Elastic Search, and other instances on a regular basis.

There are multiple queues which are distributed across two dedicated worker nodes.

- Default
- Ingress
- Push
- Pull
- Mailers
- Scheduler (only on Exec)

An explanation for the purpose of each queue can be found on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/scaling/#sidekiq-queues).

### Elastic Search

This is considered an optional component for Mastodon deployments, but it utilized on vmst.io.
We use a dedicated VM running [Open Search](https://opensearch.org) to provide the ability to perform full text searches on your posts and other content you've interacted with.
Open Search is a fork of Elastic Search 7, that started in 2021.

### Translation API

We use the free tier of DeepL as a translation API for our Mastodon Web client interface.
Since the translation feature is not used extensively on vmst.io, we do not plan to go beyond the free tier and begin paying for a different tier, or stand up our own self-hosted translation API, but will evaluate this again in the future should the need arise.

### SMTP

We use Sendmail as our managed SMTP service, for sending new user sign-up verifications, and other account notifications
For more information please refer to our [Mailer](/mailer) page. 

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

## Monitoring

We monitor the health and availability of our infrastructure in a few different ways.

### Uptime Kuma

This powers our [status.vmst.io](https://status.vmst.io) page.
It runs on a dedicated VM for this purpose, with it's own Nginx frontend.
In addition to providing a page for members to check when there might be issues, it actively alerts our team in our internal Slack to any issues.

For more information on this topic please see our [Monitoring](/monitoring) page.

### Digital Ocean

We use integrated metrics monitoring available through Digital Ocean to monitor and alert based CPU, memory, disk and other performance metrics of the host virtual machine and managed database systems.
These alerts are sent to our internal Slack.

We also have active monitoring of the worldwide accessibility of our web frontends.
These alerts are sent to our internal Slack and to the email of our server administrators.

### Prometheus & Grafana

We have a self-hosted instance of Prometheus which collects metrics from Mastodon via it's integrated StatsD system.
Grafana is used to visualize the metrics on dashboards.

These dashboards are only used by our team, and are currently not publicly accessible. 