---
title: Infrastructure
description: Where the bits go, to and fro
tags:
  - servers
  - docs
---

## Introduction

The purpose of this document is to provide an overview of the infrastructure used to operate the Mastodon instance, and ancillary services, that make up [vmst.io](https://vmst.io). It should explain how the various services interact, and how _the magic happens_ when our users open the Mastodon app on their phone or enter our address in their web browser.

Unfortunately though it's not really magic, but a series of databases and micro-services from  various open source vendors, running in _The Cloud_.

## Architecture Goals

- Be highly available for all critical components.
- Be scalable both vertically and horizontally.
- Be a highly performant experience for our users.
- Be a stable endpoint on the [ActivityPub](https://activitypub.rocks) network.

## Layout

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

Our core service is the Mastodon platform located at [vmst.io](https://vmst.io).

[Digital Ocean](https://www.digitalocean.com) is our primary hosting provider for this service. Our primary data centers are TOR1 and NYC3, with Toronto holding the bulk of the workloads and New York for the object store and this site.

### Required Components

The following reflect the required software components to have a functional deployment of Mastodon:

- HTTP Proxy (typically, [Nginx](https://nginx.org/))
- [Mastodon](https://github.com/mastodon/mastodon) (obviously)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

Depending on the sizing of the instance, this could all be deployed on one Linux machine.

### Additional Components

Most Mastodon deployments leverage one or more additional components to provide additional functionality.

Some of them include:

- Full Text Search
- Translation API
- [Object Storage](https://en.wikipedia.org/wiki/Object_storage)
- [SMTP Relay](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)

## Deployment History

When vmst.io originally moved away from managed hosting with [Masto Host](https://masto.host), the deployment was done with:

- Three consolidated core nodes using Docker containers for all essential services.
- One backend node running Redis, Elastic Search, and Sidekiq. These components also ran in Docker containers.
- One managed PostgreSQL database instance.
- The object store for media uploads.

(More information on that original configuration [can be found here](https://docs.vmst.io/post/2022/11/new-infrastructure/).)

Over many iterations, we eventually moved Redis to a managed instance, separated Elastic Search to it's own host, and got better about controlling Sidekiq queues.

What also became apparent over time is that the Docker containers for Mastodon burn a lot of CPU cycles, when deployed as we had done.

We have since moved all of the Mastodon components to locally compiled code running with Linux systemd services.
Not only has this proven more efficent, it's provided more flexibility.

### Kubernetes

We do not currently leverage Kubernetes for any part of the vmst.io configuration. We may explore this again in the future. 

Docker containers are still used to deploy some of our "Flings" as documented below.

## Code Purity

Our goal is to run the latest released version of the Mastodon experience within 48 hours of being published.

In order to help facilitate this, we run **unmodified** versions of the Mastodon code found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository.

We do not run any of the available Mastodon forks (such as [Glitch](https://glitch-soc.github.io/docs/) or [Hometown](https://github.com/hometown-fork/hometown)) or perform any other local modifications to the Mastodon stack. We do not intend to modify or customize Mastodon code in any other way that changes the default user experience.

## Core Elements

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

We use [Nginx](https://www.nginx.com) as our reverse proxy software, running on dedicated Droplets. Nginx is installed using the [stable branch repository] for Debian. Currently this is version 1.22.

What is a reverse proxy? As [defined by Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/):

> It's a server that sits in front of one or more web servers, intercepting requests from clients. This is different from a forward proxy, where the proxy sits in front of the clients. With a reverse proxy, when clients send requests to the origin server of a website, those requests are intercepted at the network edge by the reverse proxy server. The reverse proxy server will then send requests to and receive responses from the origin server. The reverse proxy ... ensures that no client ever communicates directly with that origin server.
  
Our Nginx reverse proxies provide TLS/SSL termination as well as internal load balancing for both the core Mastodon service and any of our Flings.

![Reverse Proxy Diagram](https://cdn.vmst.io/docs/reverse-proxy-diagram.png)

Under normal circumstances there are at least two virtual machines (Sulu and Chekov) running Nginx, with 1 vCPU and 1 GB of memory each. Any major changes are usually tested by a temporary third node, which is then validated, and used as a new base image for the remaining nodes.

## Mastodon Elements

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

Additionally, in the default configuration where Nginx and Mastodon Puma would run on the same node, there are static files (CSS and image) that make up the user interface that are served directly by Nginx.
Because we seperate Nginx into it's own tier on different machines, there is a setting to tell the Mastodon web server to serve these files instead.

```text
RAILS_SERVE_STATIC_FILES=true
```

According to [the Mastodon documentation](https://docs.joinmastodon.org/admin/config/#rails_serve_static_files) this does increase load on the Mastodon server but in our experiance it's not been a measurable difference.

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

#### Tuning

Mastodon administration is about 30% community management, 20% general server managagement, and 50% of figuring out what you've done to anger Sidekiq.

The default deployment of Mastodon when deployed from source generates one Sidekiq service which 25 threads.
The default Docker deployment uses 5 threads.
Each thread when active has _the potential_ to be an active connection to the Postgres database, but it might also do something else entirely, like send email or fetch a remote image or tell another server that you've posted.

There are two values that must be managed for Sidekiq:

- The threads assigned to the service, which can be done in the `.service` file or in the `docker-compose.yml` file depending on the deployment type.
- The `DB_POOL` variable that sets the maximum amount of open connections that the service can have to the database, keeping in mind that not every thread is going to open a connection.

These two values should always be the same, for each instance of Sidekiq.

Again, by default there is only one instance of Sidekiq.
In the more generous configuration given by a systemd deployment, 25 threads may be enough for only a few years in an instance but this will quickly be overrun under load by a deployment at scale.

The solution to this could be to add additional threads to your service, but as explained this comes at a cost in additional database connections.
But again, it's maximum potential number of open connections.
Postgres has limits based on the size of the deployment, and as explained more below this can be overcome by utilizing pgBouncer as part of the deployment.

The first thought would be to increase the number of threads in your Sidekiq service file from 25 to 30, 50, 100, etc.
This is incorrect.
Sidekiq does not utilize more than the 25-30 threads generated by a single service, you'll simply burn CPU cycles and waste possible database connections doing nothing.

The solution is to spawn more Sidekiq workers by creating additional systemd services or Docker containers dedicated to Sidekiq.
Each service should then by limited to the queue(s) that you want them to process in the order of their priority.

Example `mastodon-sidekiq-push-pull.service` configuration file:

```text
...
Environment="RAILS_ENV=production"
Environment="DB_POOL=25"
Environment="MALLOC_ARENA_MAX=2"
Environment="LD_PRELOAD=libjemalloc.so"
ExecStart=/root/.rbenv/shims/bundle exec sidekiq -c 25 -q push -q pull
...
```

As configured this service fill will only process the push and the pull queues shown with the `-q` options, in the order listed.
It also has a maximum of open database connections of 25 set in `DB_POOL` with 25 threads set in the `-c` option.

#### Thread Count

We have our Sidekiq queues configured as such:

| Queue     | Scotty | Decker |
|-----------|------|-----|
| Push      | 25   | 25  |
| Pull      | 25   | 25  |
| Default   | 25   | 25  |
| Ingress   | 40   | 25  |
| Scheduler |      | 15  |
| Mailer    | 5    | 5   |
| Total     | **120**  | **120** |

Each Droplet has six service files for Sidekiq running.
Each service file has a maximum thread and database pool limit of 25, with the exception of Scotty which has an additional Ingress queue service limited to 15.
Mastodon does not want the scheduler service running more than once, so it only exists on Decker.
The Ingress queue tends to be more demanding on CPU usage and because Decker is also responsible for backups, there is a small difference in the amount of processing done between the two in terms of Sidekiq, but not in overall utilization.

With the exception of scheduled tasks the loss of one Sidekiq host or the other should not have any major impact on the ability of the instance to function.

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

### Elastic Search

This is considered an optional component for Mastodon deployments, but it utilized on vmst.io.
We use a dedicated VM running [Open Search](https://opensearch.org) to provide the ability to perform full text searches on your posts and other content you've interacted with.

Open Search is a fork of Elastic Search 7, which started in 2021.

There is one virtual machine (Khan) with 1 vCPU and 2GB of memory. It provides _khantext_. Get it?

While full text search is a great feature, since it only runs on one Droplet so in the event of a failure or reboot of the node there is only a temporary service distruption.
That said, the long term plan is to add high availibility to this component at a later date.

### Translation API

We use the free tier of [DeepL](https://www.deepl.com/translator) as a translation API for our Mastodon Web client interface.
Since the translation feature is not used extensively on vmst.io, we do not plan to go beyond the free tier and begin paying for a different tier, or stand up our own self-hosted translation API, but will evaluate this again in the future should the need arise.

![DeepL Usage](https://cdn.vmst.io/docs/deepl-usage.png)

### SMTP Relay

We use Sendmail as our managed SMTP service, for sending new user sign-up verifications, and other account notifications.

Example of `.env.production` configuration settings relevant to SMTP:

```text
# Mail
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=465
SMTP_LOGIN=apikey
SMTP_PASSWORD=nevergonnagiveyouup
SMTP_FROM_ADDRESS='Mastodon <mastodon@mailer.vmst.io>'
SMTP_SSL=true
SMTP_DELIVERY_METHOD=smtp
```

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

We utilize [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) as our backup provider.

### Database Backups

Posts made to vmst.io and write.vmst.io are stored in backend databases (Postgres and MySQL) with Redis used as a key value store and timeline cache for vmst.io.

- For the backup of Postgres we use `pg_dump`.
- For the backup of Redis we use `redis-cli`.
- For the backup of MySQL we use `mysqldump`.
- The [Backblaze native](https://www.backblaze.com/b2/docs/quick_command_line.html) `b2-cli` utility is then used to make a copy of those backups a Backblaze B2 bucket.
- This is done using some custom scripts that process each task and then fire off notifications to our backend Slack.
- Database backups are currently made every 4 hours.
- Database backups are retained for 14 days.
- All backups are encrypted both in transit and at rest.

![SQL Backups](https://cdn.vmst.io/docs/sql-backups.png)

### Media/CDN Store Backups

- The CDN/media data is sync'd directly to Backblaze B2 via the `rclone` [utility](https://rclone.org).
- This is done using some custom scripts that process each task and then fire off notifications to our backend Slack.
- CDN backups currently run every 4 hours.
- Only the latest copy of CDN data is retained.
- All backups are encrypted both in transit and at rest.

### Configuration Backups

- All configuration files for core applications, documentation and flings are stored on GitHub with changes committed there before being applied to servers.
- Each virtual machine tier has an updated snapshot on Digital Ocean for easy deployment to horizontally scale, or to replace failed systems quickly.

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

## Networking

The local IP space used between systems on our virtual private cloud (VPC) network, is issued by Digital Ocean, with static IP addresses that are assigned at creation of the Droplet and persist throughout the lifecycle of the virtual machines. 

Where possible any communication between internal nodes is encrypted even though the communication takes place on the VPC network.

There are a few cases where traffic leaves our VPC but still communicates within the Digital Ocean network, such as when data is moved between Droplets in Toronto and the Object Storage in NYC.

### Public IPs

The public IP addresses assigned to our load balancer and virtual machines, are static IP addresses issued and owned by Digital Ocean. They are assigned at creation and persist throughout the lifecycle of the virtual machine.

status.vmst.io and sites which are behind our load balancer (which is used as the entry point for all traffic) are the only user  accessible systems via a public address.

This does not include sites behind any CDN provider which may respond with any variety of addresses which we also do not control.

#### IPv6

At this time none of our systems are accessible via IPv6. This is due to a [known limitation](https://docs.digitalocean.com/products/networking/load-balancers/details/limits/) of Digital Ocean's managed load balancer service.

As the load balancer is our entry point for all other services, we do not enable IPv6 for Droplets even though it is technically supported.

#### DNS Resolution

We use [DNSimple](https://dnsimple.com/) for our domain registrar and nameserver. We have DNSSEC enabled on our domain.

## Security

In order to protect our user's privacy and data we implement a number of different security measures on our systems.

They include:

- Preventing unnecessary external access to systems through OS and service provider firewalls, and limiting communication between internal systems only to the source/destination ports and protocols required for functionality.
- Blocking any access to the system from known problematic networks, and leveraging an intrusion detection system to detect and deny access to active bad actors.
- Using updated versions, from trusted sources, of the source code and binaries downloaded to our systems.
- Requiring encrypted connections to all public facing elements, deprecating insecure ciphers, and using secure commections where possible even on private networks, for communication between internal systems.

### Certificates

We use [Sectigo](https://sectigo.com/) as our primary certificate authority, with the exception of docs.vmst.io which uses a certificate issued by Cloudflare.

Sectigo was utilized after testing [Let's Encrypt](https://letsencrypt.org/), but the automated validation system presented some challenges for us that were solved by using a legacy commerical CA.

Once our existing wildcard certificate has expired in late 2023, we intend to try again to use Let's Encrypt.

## Naming Conventions

Our servers are named after characters and actors from the original Star Trek series, and other 23rd century derivatives.

Live long and prosper.