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

- Be highly available for all critical components.
- Be scalable both vertically and horizontally.
- Be a highly performant experience for our users.
- Be a stable endpoint on the ActivityPub network.

## Providers

| **Vendor** | **Service** |
|---|---|
| Digital Ocean | Managed Databases, Load Balancer Services, CDN/Object Store, Virtual Machines (Droplets) |
| DNSimple | Registrar, Nameservers & SSL Certificate (via Sectigo) |
| Backblaze | Database & Media Backups on B2 |
| Sendgrid | SMTP Relay |
| GitHub | Configuration repository |
| Slack | Team Communications |

## Core Services

Our core service is the Mastodon platform located at [vmst.io](https://vmst.io).

[Digital Ocean](https://www.digitalocean.com) is our primary hosting provider for this service. Our primary data centers are TOR1 and NYC3, with Toronto holding the bulk of the workloads and New York for the object store and this site.

### Required Components

The following reflect the required software components to have a functional deployment of Mastodon:

- HTTP Proxy (typically Nginx)
- Mastodon
- PostgreSQL
- Redis

Depending on the sizing of the instance, this could all be done on one host operating system.

### Additional Components

Most Mastodon deployments leverage one or more additional components to provide additional functionality
Some of them include:

- Elastic Search
- Translation API
- Object Store
- SMTP

## Deployment Overview

When vmst.io originally moved away from managed hosting with [Masto Host](https://masto.host), the deployment was done with:

- Three consolidated core nodes using Docker containers for all essential servers
- One backend node running Redis, Elastic Search, and Sidekiq.
- One managed PostgreSQL database instance.
- The object store and CDN.

(More information on that original configuration [can be found here](https://docs.vmst.io/post/2022/11/new-infrastructure/).)

Over many iterations and changes, we eventually moved Redis to a managed instance, separated Elastic Search to it's own host, and got better about controlling Sidekiq queues.
What also became apparent over time is that the Docker containers for Mastodon burn a lot of CPU cycles when deployed as we had done.

We have since moved all of the Mastodon components to locally compiled code running with Linux systemd services.

### Kubernetes

We do not currently leverage Kubernetes for any part of the vmst.io configuration. Docker containers are still used to deploy some of our "Flings" as documented below.

### Code Purity

Our goal is to run the latest released version of the Mastodon experience within 48 hours of being published.

In order to help facilitate this, we run **unmodified** versions of the Mastodon code found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository.

We do not run any of the available Mastodon forks (such as [Glitch](https://glitch-soc.github.io/docs/) or [Hometown](https://github.com/hometown-fork/hometown)) or perform any other local modifications to the Mastodon stack. We do not intend to modify or customize Mastodon code in any other way that changes the default user experience.

### Virtual Machines

We use an all virtual machine architecture using Digital Ocean "Droplets" with [Debian 11](https://www.debian.org) as the base operating system for our self-managed systems.

We use the snapshot functionality to keep updated customized base images for each tier.
Should there be a failure of a node or a need to scale horizontally and add additional Droplets to a tier, it can be done with limited effort.

![Digital Ocean Snapshots](https://cdn.vmst.io/docs/do-snapshots.png)

### Load Balancing

We use Digital Ocean managed load balancer objects, based on [HAProxy](https://www.haproxy.org), to distribute user traffic across our frontend reverse proxies.

![Digital Ocean Load Balancer](https://cdn.vmst.io/docs/do-loadbalancer.png)

Our single load balancer object (Pike) is rated for 10,000 concurrent connections, but even under heavy load we only consume 10% of that capacity.

### Reverse Proxies

We use [Nginx](https://www.nginx.com) as our reverse proxy software, running on dedicated Droplets.

What is a reverse proxy? As [defined by Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/):

> It's a server that sits in front of one or more web servers, intercepting requests from clients. This is different from a forward proxy, where the proxy sits in front of the clients. With a reverse proxy, when clients send requests to the origin server of a website, those requests are intercepted at the network edge by the reverse proxy server. The reverse proxy server will then send requests to and receive responses from the origin server. The reverse proxy ... ensures that no client ever communicates directly with that origin server.
  
Our Nginx reverse proxies provide TLS/SSL termination as well as internal load balancing for both the core Mastodon service and any of our Flings.

![Reverse Proxy Diagram](https://cdn.vmst.io/docs/reverse-proxy-diagram.png)

Under normal circumstances there are at least two virtual machines (Sulu and Chekov) running Nginx, with 1 vCPU and 1 GB of memory each.

## Mastodon Core

Aside from the various external dependencies, Mastodon is three main applications:

- Web UI & API
- Streaming API
- Sidekiq

### Web

The Mastodon Web tier consists of the Mastodon Web UI/API and the separate Streaming API service.

Under normal circumstances there are at least two virtual machines (Kirk, Spock) running these components, with 2 vCPU and 4 GB of memory each.

#### Puma

What users perceive as "Mastodon" is a [Ruby on Rails](https://rubyonrails.org) application (with [Puma](https://puma.io) running as the web/presentation layer) providing both ActivityPub/Federation and the web user experience.
We use the Ruby versions and modules that are dictated on the documentation for installing Mastodon from source on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/install/).

Based on recommendations by the developer of Puma, and others in the Mastodon administration community, we have Puma configured in `.env.production` and `mastodon-web.service`, as follows:

```text
WEB_CONCURRENCY=3
MAX_THREADS=9
```

This follows a ratio of `vCPU * 1.5` for concurrency.
The number of threads is then `concurrency * 3`.

#### Streaming

The Streaming API is a separate [node.js](https://nodejs.org/en/) application which provides a background WebSockets connection between your browser session and the Mastodon server to provide real-time "streaming" updates as new posts are loaded to your timeline, to send notifications, etc.

We currently use the node.js versions that are dictated on the documentation for installing Mastodon from source on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/install/), which at this time is node.js 16.x LTS but due to it's pending end of life will be upgraded to node.js 18.x LTS as soon as it's confirmed to be supported.

As explained more in-depth in another section, the connection to the Digital Ocean managed Redis database must be done via TLS. For the Streaming API, there are additional configuration options that must be set to allow node.js to connect when it expected an non-encrypted connection by default.

Example of `.env.production` configuration settings relevant to Streaming:

```text
# Streaming
STREAMING_API_BASE_URL=wss://streaming.vmst.io
DB_SSLMODE=require
NODE_EXTRA_CA_CERTS=/path/to/certs/do-internal.crt
```

The `DB_SSLMODE` and `NODE_EXTRA_CA_CERTS` settings are not there by default. The Digital Ocean databases use self-signed/private certificates, but the variable set will tell the Streaming API to trust that connection based on the CA that are downloaded from Digital Ocean and upload to the server.

### Persistence

The persistent data in the Mastodon environment are represented by user posts which are stored in a PostgreSQL database, and user media/attachments which are stored in an S3-compatible object store.

#### Postgres

We use the Digital Ocean managed SQL database service, this delivers a highly available database backend. Updates and maintenance are performed by Digital Ocean, independent of our administration efforts. 

There is one active Postgres database instance (Majel) with 2 vCPU and 4GB of memory, with a standby instance ready to take over automatically in the event of system failure.

Digital Ocean instance "T-Shirt" sizes for databases are done by vCPU, memory, disk size, and connections to the database.
The connection count limits are based on sizing best practices for PostgreSQL, with a few held in reserve for their use to manage the service.
Digital Ocean has an integrated "Connection Pool" feature of their platform which in effect puts the pgBouncer utility in front of the database.
This effectively acts as a reverse proxy / load balancer for the database, to make sure that connections to the database by Mastodon cannot stay open and consume resources longer than needed.

There are a [few options for pooling modes](https://docs.digitalocean.com/products/databases/postgresql/how-to/manage-connection-pools/#pooling-modes) with Digital Ocean, but the default _Transaction Mode_ is the required option for Mastodon.

Example of `.env.production` configuration settings relevant to Postgres:

```text
# PostgreSQL
DB_HOST=path-to-postgres-database.ondigitalocean.com
DB_PORT=25061
DB_NAME=the_mastodon_connection_pool
DB_USER=the_mastodon_user
DB_PASS=Ourpassw0rd!sNoneofyourbu$iness
PREPARED_STATEMENTS=false
```

The `PREPARED_STATEMENTS=false` is [required of Mastodon to use pgBouncer](https://docs.joinmastodon.org/admin/scaling/#pgbouncer).
When performing upgrades of Mastodon that require changes to the database schema, you **must** temporarily modify the configuration on the system running the schema change to bypass pgBouncer and go directly to the database.
You will need to remove the line with the prepared statement configuration or set it to true, then change the DB port and DB name values.

#### Object Store

We use the Digital Ocean managed object store (Spaces), which includes a content delivery network (CDN) to distribute uploaded and federated media around the world, to reduce access latency for users.

Example of `.env.production` configuration settings relevant to Digital Ocean's Object Store:

```text
# Object Store
S3_ENABLED=true
S3_PROTOCOL=https
S3_BUCKET=ourbucketname
S3_REGION=nyc3
S3_HOSTNAME=nyc3.digitaloceanspaces.com
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
AWS_ACCESS_KEY_ID=NOTINAMILLI0NYEARS
AWS_SECRET_ACCESS_KEY=hahahahahahahahahahahahaha
S3_ALIAS_HOST=cdn.vmst.io
```

Our Object Store (Spaces) is in the Digital Ocean NYC3 data center, which is separate from the rest of the workloads which exist in the TOR1 (Toronto) data center.
By default, the items in the Space are accessible through a non-CDN accessible endpoint, but once that is created on the Digital Ocean side, is set in Mastodon by using the `S3_ALIAS_HOST` variable.

### Redis

We use the Digital Ocean managed database service, this delivers a highly available database backend.

There is one active Redis database instance (it doesn't have a fun name) with 1 vCPU and 2GB of memory, with a standby instance ready to take over automatically in the event of system failure.

#### Stunnel

Digital Ocean requires encrypted/TLS connections to their managed Redis instances, however the Mastodon codebase includes a Redis library which does not have a native TLS capability.
[Stunnel](https://www.stunnel.org) is used as a proxy to take the un-encrypted connection requests and encrypt those connections between the Mastodon components and Redis.
This process is used on our Mastodon Web and Sidekiq nodes.

![Stunnel Workflow](https://cdn.vmst.io/docs/stunnel-workflow.png)

Example of `/etc/stunnel/redis.conf` configuration file:

```text
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

![DeepL Usage](https://cdn.vmst.io/docs/deepl-usage.png)

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

![SQL Backups](https://cdn.vmst.io/docs/sql-backups.png)

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
It's automatically generated anytime there is an push event to the [underlying Git repository](https://github.com/vmstan/vmstio).
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

We use Sectigo as our primary certificate authority, with the exception of docs.vmst.io which uses a certificate issued by Cloudflare.

## Naming Conventions

Our servers are named after characters and actors from the original Star Trek series, and other 23rd century derivatives.
