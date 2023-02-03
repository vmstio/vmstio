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

## Architecture Goals

- Be highly available for critical components. No one server going offline should impact system availability.
- Be scalable both vertically and horizontally. Increased activity/load should be easily absorbed, and unused resources shed when they're not needed.

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

Our core service is the Mastodon platform located at [vmst.io](https://vmst.io). 

[Digital Ocean](https://www.digitalocean.com) is our primary hosting provider for this service. Our primary data centers are TOR1 and NYC3, with Toronto holding the bulk of the workloads and New York for the object store and this site.

### Required Components

- Nginx Reverse Proxy
- Mastodon Core (Puma/Streaming)
- Mastodon Sidekiq
- Postgres Database
- Redis Database/Cache
- Stunnel
- Elastic Search
- Translation API
- Object Store
- SMTP

## Deployment Overview

When vmst.io originally moved from managed hosting with [Masto Host](https://masto.host), the deployment was done with:

- Three consolidated core nodes using Docker containers for all essential servers
- One backend node running Redis, Elastic Search, and Sidekiq.
- One managed PostgreSQL database instance.

Over many iterations and changes, we eventually moved Redis to a managed instance, separated Elastic Search, and got better about controlling Sidekiq queues.
What also became apparent over time is that the Docker containers for Mastodon burn a lot of CPU cycles when deployed as we had done.

We have since moved all of the Mastodon components to locally compiled code running with Linux systemd services.

Docker is still used to deploy some of our "Flings" as documented below.

### Kubernetes

We do not currently leverage Kubernetes for any part of the vmst.io configuration.

### Code Purity

Our goal is to run the latest released version of the Mastodon experience within 48 hours of being published.

In order to help facilitate this, we run **unmodified** versions of the Mastodon code found on the project's official [GitHub](https://github.com/mastodon/mastodon) repo.

We do not run any of the available Mastodon forks (such as [Glitch](https://glitch-soc.github.io/docs/) or [Hometown](https://github.com/hometown-fork/hometown)) or perform any other local modifications to the Mastodon stack. We do not intend to modify or customize Mastodon code in any other way that changes the default user experience.

### Virtual Machines

We use Digital Ocean "Droplets" with [Debian 11](https://www.debian.org) as the base operating system for our self-managed virtual machines.

We use the snapshot functionality to keep updated customized base images for each tier, this was should there be a failure of a node or a need to scale horizontally and add additional Droplets to a tier, it can be done with limited effort.

![Digital Ocean Snapshots](https://cdn.vmst.io/docs/do-snapshots.png)

### Load Balancing 

We use Digital Ocean managed load balancer objects, based on HAProxy, to distribute user traffic across our frontend reverse proxies.

A single load balancer object (Pike) is rated for 10,000 concurrent connections, but even under extreme load we consume 10% of that capacity.

### Reverse Proxies

We use Nginx as the reverse proxy software running on dedicated Droplets.
The Nginx tier provides TLS/SSL termination and internal load balancing for both the core Mastodon service and any of our Flings.

We use the upstream stable Nginx repos.

There are two virtual machines (Sulu and Chekov) with 1 vCPU and 1 GB of memory each.

## Mastodon Core

### Mastodon Web

The Mastodon Web tier consists of the Core Mastodon experience which is a Ruby application with Puma as the web/presentation service, providing both ActivityPub/Federation and the web user experience, and the separate Streaming API service which is a node.js application.
We use the Ruby and node.js versions which are recommended in the documentation for installing Mastodon from source on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/install/).

There are two virtual machines (Kirk, Spock) with 2 vCPU and 4 GB of memory each.

### Persistence

The persistent data in the Mastodon environment are represented by user posts which are stored in a PostgreSQL database, and user media/attachments which are stored in an S3-compatible object store.

#### Postgres

We use the Digital Ocean managed SQL database service, this delivers a highly available database backend. We the the integrated pgBouncer connection pool.

There is one active Postgres database instance (Majel) with 2 vCPU and 4GB of memory, with a standby instance ready to take over automatically in the event of system failure.

#### Object Store

We use the Digital Ocean managed object store (Spaces), which includes a content delivery network (CDN) to distribute uploaded and federated media around the world, to reduce access latency for users.

### Redis

We use the Digital Ocean managed database service, this delivers a highly available database backend.

There is one active Redis database instance (it doesn't have a fun name) with 1 vCPU and 2GB of memory, with a standby instance ready to take over automatically in the event of system failure.

#### Stunnel

Digital Ocean requires encrypted/TLS connections to their managed Redis instances, however the Mastodon codebase includes a Redis library which does not have a native TLS capability.
[Stunnel](https://www.stunnel.org) is used as a proxy to take the un-encrypted connection requests and encrypt those connections between the Mastodon components and Redis.
This process is used on our Mastodon Web and Sidekiq nodes.

![Stunnel Workflow](https://cdn.vmst.io/docs/stunnel-workflow.png)

Example of `/etc/stunnel/redis.conf` configuration file:

```
pid = /run/stunnel-redis.pid
delay = yes
[redis-client]
client = yes
accept = 127.0.0.1:6379
connect = path-to-redis-database.ondigitalocean.com:25061
```

We've found that the `delay = yes` component is essential to this configuration but is not well documented or in the default configuration files.
Without this setting, anytime there is a change in Redis services backend location (such as after a update, resize, or an HA event) the Stunnel client does not automatically reconnect to the database, leaving Mastodon services in a failed state and without the ability to communicate to Redis until the Stunnel service is restarted.

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
- Scheduler (only on Decker)

An explanation for the purpose of each queue can be found on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/scaling/#sidekiq-queues).

There are two virtual machines (Scotty and Decker) with 2 vCPU and 4 GB of memory each.

### Elastic Search

This is considered an optional component for Mastodon deployments, but it utilized on vmst.io.
We use a dedicated VM running [Open Search](https://opensearch.org) to provide the ability to perform full text searches on your posts and other content you've interacted with.

Open Search is a fork of Elastic Search 7, which started in 2021.

There is one virtual machine (Khan) with 1 vCPU and 2GB of memory. It provides _khantext_. Get it?

### Translation API

We use the free tier of [DeepL](https://www.deepl.com/translator) as a translation API for our Mastodon Web client interface.
Since the translation feature is not used extensively on vmst.io, we do not plan to go beyond the free tier and begin paying for a different tier, or stand up our own self-hosted translation API, but will evaluate this again in the future should the need arise.

### SMTP

We use Sendmail as our managed SMTP service, for sending new user sign-up verifications, and other account notifications
For more information please refer to our [Mailer](/mailer) page. 

## Flings

Outside of our core service we run a number of "Flings" such as:

- [elk.vmst.io](https://elk.vmst.io)
- [semaphore.vmst.io](https://semaphore.vmst.io)
- [write.vmst.io](https://write.vmst.io)
- [matrix.vmst.io](https://matrix.vmst.io)

When possible we will run these in a highly available way, behind our security systems and load balancers, but may only be on single backend nodes. Our flings leverage much of the existing core service infrastructure like the Nginx reverse proxies and Postgres. In addition we have the following specific to our Flings:

- One virtual machines (Uhura) with 2 vCPU and 4 GB of memory.
- MySQL running on one managed instance with 1 vCPU and 1 GB of memory.

### Matrix

Our Matrix deployment is based on [Synapse](https://matrix.org/docs/projects/server/synapse) server, running in a Docker container from the project's official [Docker Hub image](https://hub.docker.com/r/matrixdotorg/synapse). Although it is behind our load balancer and multiple reverse proxies, it is currently **not** in a true high availability configuration as it only exists on one Fling backend node.

### Other Sources

Similar to our policy on our core services, we seek to run the latest released version of our Fling components from their upstream projects.
However in some cases we are contributing to the development of these projects, and from time to time may run modified versions to assist with this task.

Our activity level may vary from Fling to Fling with our contributions to the upstream project.

- [Elk](https://github.com/elk-zone/elk)
- [Semaphore](https://github.com/NickColley/semaphore)
- [WriteFreely](https://writefreely.org)

## Backups

We utilize Backblaze B2 as our backup provider.

### Database Backups

Posts made to vmst.io and write.vmst.io are stored in backend databases (Postgres and MySQL) with Redis used as a key value store and timeline cache for vmst.io.

- For the backup of Postgres we use `pg_dump`.
- For the backup of Redis we use `redis-cli`.
- For the backup of MySQL we use `mysqldump`.
- The native `b2-cli` utility is then used to make a copy of those backups a Backblaze B2 bucket.
- This is done using some custom scripts that process each task and then fire off notifications to our backend Slack.
- Database backups are currently made every 4 hours.
- Database backups are retained for 14 days.
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

## Documentation

Our documentation website runs directly from the free tier of Digital Ocean's app platform.
It is a [Hugo](https://gohugo.io) static website using the [PaperModX](https://github.com/reorx/hugo-PaperModX) theme.
It's automatically generated anytime there is an push event to the [underlying Git repo](https://github.com/vmstan/vmstio).
It uses an integrated CDN provided by Digital Ocean.

## Monitoring

We monitor the health and availability of our infrastructure in a few different ways.

### Uptime Kuma

This powers our [status.vmst.io](https://status.vmst.io) page.
It runs on a dedicated VM for this purpose, with it's own Nginx frontend.
In addition to providing a page for members to check when there might be issues, it actively alerts our team in our internal Slack to any issues.

For more information on this topic please see our [Monitoring](/monitoring) page.

There is one virtual machines (Kyle) with 1 vCPU and 1 GB of memory.

### Digital Ocean

We use integrated metrics monitoring available through Digital Ocean to monitor and alert based CPU, memory, disk and other performance metrics of the host virtual machine and managed database systems.
These alerts are sent to our internal Slack.

We also have active monitoring of the worldwide accessibility of our web frontends.
These alerts are sent to our internal Slack and to the email of our server administrators.

### Prometheus & Grafana

We have a self-hosted instance of Prometheus which collects metrics from Mastodon via it's integrated StatsD system.
Grafana is used to visualize the metrics on dashboards.

These dashboards are only used by our team, and are currently not publicly accessible.

## Security

In order to protect our user's privacy and data we implement a number of different security measures on our systems.

While it wouldn't be prudent to document all of the active measures, they also include:

- Preventing unnecessary external access to systems through OS and service provider firewalls, and limiting communication between internal systems only to ports and systems required for functionality.
- Using a web application firewall (WAF) on Nginx nodes, and leveraging threat intelligence providers to detect block (IPS) access from known bad actors.
- Using updated versions from trusted sources of the base operating system, libraries and applications.
- Requiring TLS connections to all public facing elements, deprecating insecure ciphers, and using TLS and/or private networks for communication between internal systems.

### Certificates

We use Sectigo as our primary certificate authority, with the exception of our docs.vmst.io which uses a certificate issued by Cloudflare.

## Naming Conventions

Our servers are named after characters and actors from the original Star Trek series, and other 23rd century derivatives.