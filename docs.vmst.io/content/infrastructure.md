---
title: Infrastructure
description: Where the bits go, to and fro
lastmod: .Lastmod
tags:
 - servers
 - docs
---

## Introduction

The purpose of this document is to provide an overview of the infrastructure used to operate the Mastodon instance, and ancillary services, that make up [vmst.io](https://vmst.io).
It should explain how the various services interact, and how _the magic happens_ when our users open the Mastodon app on their phone or enter our address in their web browser.

Unfortunately though it's not really magic, but a series of databases and micro-services from various open source vendors, running in _The Cloud_.

## Architecture Goals

- Be highly available for all critical components.
- Be scalable both vertically and horizontally.
- Be a highly performant experience for our users.
- Be a stable endpoint on the [ActivityPub](https://activitypub.rocks) network.

## Layout

![Server Layout](https://cdn.vmst.io/docs/vmstio-simple-tall-feb21.png)

## Providers

| Vendor | Service |
|---|---|
| Digital Ocean | Managed Databases, Load Balancer Services, Object Storage, Virtual Machines (Droplets) |
| Netlify | Static Site |
| DNSimple | Registrar, Nameservers & SSL Certificate (via Sectigo) |
| Backblaze | Database & Media Backups on B2 |
| Mailgun | SMTP Relay |
| GitHub | Configuration Repository |
| Slack | Team Communications |

## Core Services

Our core service is the Mastodon platform located at [vmst.io](https://vmst.io).

[Digital Ocean](https://www.digitalocean.com) is our primary hosting provider for this service.
Our primary data centers are TOR1 and NYC3, with Toronto holding the bulk of the workloads and New York for the object storage and this site.

### Required Components

The following reflect the required software components to have a functional deployment of Mastodon:

- [Nginx](https://nginx.org/)
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

When [vmst.io](https://vmst.io) originally moved away from managed hosting with [Masto Host](https://masto.host), the deployment was done with:

- Three consolidated core nodes using Docker containers for all essential services.
- One backend node running Redis, Elastic Search, and Sidekiq.
These components also ran in Docker containers.
- One managed PostgreSQL database instance.
- The object storage for media uploads.

(More information on that original configuration [can be found here](https://docs.vmst.io/post/2022/11/new-infrastructure/).)

Over many iterations, we eventually moved Redis to a managed instance, separated Elastic Search to its own host, and got better about controlling Sidekiq queues.

What also became apparent over time is that the Docker containers for Mastodon burn a lot of CPU cycles when deployed as we had done.

We have since moved all of the Mastodon components to locally compiled code running with Linux Systemd services.
Not only has this proven more efficient, it's provided more flexibility.

### Kubernetes

We do not currently leverage Kubernetes for any part of the [vmst.io](https://vmst.io) configuration.
We may explore this again in the future.

Docker containers are still used to deploy some of our "Flings" as documented below.

## Code Purity

Our goal is to run the latest released version of the Mastodon experience within 48 hours of being published.

In order to help facilitate this, we run **unmodified** versions of the Mastodon code found on the project's official [GitHub](https://github.com/mastodon/mastodon) repository.

We do not run any of the available Mastodon forks (such as [Glitch](https://glitch-soc.github.io/docs/) or [Hometown](https://github.com/hometown-fork/hometown)) or perform any other local modifications to the Mastodon stack unless it's required to properly interact with our systems.
We do not intend to modify or customize Mastodon code in any other way that changes the default user experience.

## Core Elements

### Virtual Machines

We use an all virtual machine architecture using Digital Ocean "Droplets" with [Debian 11](https://www.debian.org) as the base operating system for our self-managed systems.

We use the snapshot functionality to keep updated customized base images for each tier.
Should there be a failure of a node or a need to scale horizontally and add additional Droplets to a tier, it can be done with limited effort.

![Digital Ocean Snapshots](https://cdn.vmst.io/docs/do-snapshots.png)

### Load Balancing

We use Digital Ocean managed load balancer objects, based on [HAProxy](https://www.haproxy.org), to distribute user traffic across our frontend reverse proxies.

![Digital Ocean Load Balancer](https://cdn.vmst.io/docs/do-loadbalancer.png)

Our single load balancer object ([Pike](https://memory-alpha.fandom.com/wiki/Christopher_Pike)) is rated for 10,000 concurrent connections, but even under heavy load we only consume 10% of that capacity.

### Reverse Proxies

We use [Nginx](https://www.nginx.com) as our reverse proxy software, running on dedicated Droplets.
Nginx is installed using the [stable branch repository](https://nginx.org/en/download.html) for Debian.
Currently this is version 1.22.

What is a reverse proxy? As [defined by Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/):

> It's a server that sits in front of one or more web servers, intercepting requests from clients. This is different from a forward proxy, where the proxy sits in front of the clients. With a reverse proxy, when clients send requests to the origin server of a website, those requests are intercepted at the network edge by the reverse proxy server. The reverse proxy server will then send requests to and receive responses from the origin server. The reverse proxy ... ensures that no client ever communicates directly with that origin server.

Our Nginx reverse proxies provide TLS/SSL termination as well as internal load balancing for both the core Mastodon service and any of our Flings.

![Reverse Proxy Diagram](https://cdn.vmst.io/docs/reverse-proxy-diagram.png)

Under normal circumstances there are at least two virtual machines ([Sulu](https://memory-alpha.fandom.com/wiki/Hikaru_Sulu) and [Chekov](https://memory-alpha.fandom.com/wiki/Pavel_Chekov)) running Nginx, with 1 vCPU and 1 GB of memory each.
Any major changes are usually tested by a temporary third node, which is then validated, and used as a new base image for the remaining nodes.

## Mastodon Elements

Aside from the various external dependencies, Mastodon is three main applications:

- Web UI & API
- Streaming API
- Sidekiq

### Web

The Mastodon Web tier consists of the Mastodon Web UI/API and the separate Streaming API service.

Under normal circumstances there are at least two virtual machines ([Kirk](https://memory-alpha.fandom.com/wiki/James_T._Kirk) and [Spock](https://memory-alpha.fandom.com/wiki/Spock)) running these components, with 2 vCPU and 4 GB of memory each.

#### Puma

What users perceive as "Mastodon" is a [Ruby on Rails](https://rubyonrails.org) application (with [Puma](https://puma.io) running as the web/presentation layer) providing both ActivityPub/Federation and the web user experience.
We use Ruby 3.0.x and the other modules that are dictated on the documentation for installing Mastodon from source on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/install/).

Based on recommendations by the developer of Puma, and others in the Mastodon administration community, we have Puma configured in `.env.production` and `mastodon-web.service`, as follows:

```text
WEB_CONCURRENCY=3
MAX_THREADS=9
```

This follows a ratio of `vCPU * 1.5` for concurrency.
The number of threads is then `concurrency * 3`.

Additionally, in the default configuration where Nginx and Mastodon Puma would run on the same node, there are static files (CSS and image) that make up the user interface that are served directly by Nginx.
Because we separate Nginx into its own tier on different machines, there is a setting to tell the Mastodon web server to serve these files instead.

```text
RAILS_SERVE_STATIC_FILES=true
```

According to [the Mastodon documentation](https://docs.joinmastodon.org/admin/config/#rails_serve_static_files) this does increase load on the Mastodon server, but in our experience it's not been a measurable difference.

#### Streaming

The Streaming API is a separate [node.js](https://nodejs.org/en/) application which provides a background WebSockets connection between your browser session and the Mastodon server to provide real-time "streaming" updates as new posts are loaded to your timeline, to send notifications, etc.

We currently use the node.js versions that are dictated on the documentation for installing Mastodon from source on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/install/), which at this time is node.js 16.x LTS, but due to its pending end of life, will be upgraded to node.js 18.x LTS as soon as it's confirmed to be supported.

As explained more in-depth in another section, the connection to the Digital Ocean-managed Redis database must be done via TLS.
For the Streaming API, there are additional configuration options that must be set to allow node.js to connect when it expects a non-encrypted connection by default.

Example of `.env.production` configuration settings relevant to Streaming:

```text
# Streaming
STREAMING_API_BASE_URL=wss://streaming.vmst.io
DB_SSLMODE=require
NODE_EXTRA_CA_CERTS=/path/to/certs/do-internal.crt
```

The `DB_SSLMODE` and `NODE_EXTRA_CA_CERTS` settings are not there by default.
The Digital Ocean databases use self-signed/private certificates, but the variable set will tell the Streaming API to trust that connection based on the CA certs that are downloaded from Digital Ocean and uploaded to the server.

### Sidekiq

Sidekiq is an essential part of the Mastodon environment and delivered as part of the Mastodon codebase.

Everything that happens when you interact with Mastodon—and the wider Fediverse—through our instance has to pass through Sidekiq.
It communicates with Redis, PostgreSQL, Elastic Search, and other instances on a regular basis.

In our environment, Sidekiq processes over one million tasks per day.

There are multiple queues which are distributed across two dedicated worker nodes.

- Default
- Ingress
- Push
- Pull
- Mailers
- Scheduler

An explanation for the purpose of each queue can be found on [docs.joinmastodon.org](https://docs.joinmastodon.org/admin/scaling/#sidekiq-queues).

There are two virtual machines ([Scotty](https://memory-alpha.fandom.com/wiki/Montgomery_Scott) and [Decker](https://memory-alpha.fandom.com/wiki/Will_Decker)).
Scotty has 2 vCPU and 4 GB of memory.
Decker has 4 vCPU and 8 GB of memory.

#### Tuning

Bootstrapping a Mastodon instance is about 30% community management, 20% general server management, and 50% of figuring out what you've done to anger Sidekiq.

The default install of Mastodon, when deployed from source, generates one Sidekiq service with 25 threads.

Each thread when active has _the potential_ to be an active connection to the PostgreSQL database, but it might also do something else entirely, like send an email notification or fetch a remote image, or tell another server that users have posted.
It's somewhat unpredictable.

There are two values that must be managed for Sidekiq:

- The threads assigned to the service (which can be done in the `.service` file or in the `docker-compose.yml` file depending on the deployment type.)
- The `DB_POOL` variable sets the maximum amount of open connections that the service can have to the database (keeping in mind that not every thread is going to open a connection.)

It's best practice for these values to always be the same, for each instance of Sidekiq.
Again, by default there is only one instance of Sidekiq.

25 threads may be enough for a deployment of a few hundred active users in an instance, or a larger one under light load, but one user with a popular toot that goes viral could quickly cause the queues to back up and timelines to stop updating with content until the backlog is processed.

Furthermore, when one instance struggles it causes other instances in the federation to be delayed as well, causing "red light" errors and other issues.

The solution to this could be to add additional threads to your service, but as explained this comes at a cost in additional database connections.
PostgreSQL has limits based on the size of the deployment, and as explained more below this can be overcome by utilizing pgBouncer as part of the deployment.

The first thought would be to increase the number of threads in your Sidekiq service file from 25 to 50, 100, etc.

This is incorrect.

Sidekiq does not utilize more than the 25-30 threads generated by a single service, you'll simply burn CPU cycles and waste possible database connections that are doing nothing.

The solution is to spawn more Sidekiq workers by creating additional Systemd services or Docker containers dedicated to Sidekiq.
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
It also has the maximum of open database connections of 25 set in `DB_POOL` with 25 threads set in the `-c` option.

#### Thread Count

We have our Sidekiq queues configured as such:

| Queue     | Scotty | Decker |
|-----------|------|-----|
| Push      | 25   | 25  |
| Pull      | 25   | 25  |
| Default   | 25   | 25  |
| Ingress   | 40   | 25  |
| Scheduler | -    | 15  |
| Mailer    | 5    | 5   |
| Total     | **120** | **120** |

Each Droplet has six service files for Sidekiq.

Each service file has a maximum thread and database pool limit of 25, with the exceptions of:

- Scotty which has an additional Ingress queue service limited to 15.
- Mastodon does not want the scheduler service running more than once, so it only exists on Decker, limited to 15.

The Ingress queue tends to be more demanding on CPU usage and because Decker is also responsible for backups, there is a small difference in the amount of processing done between the two in terms of Sidekiq.

With the exception of scheduled tasks, the loss of one Sidekiq host or the other should not have any major impact on the ability of the instance to function.

### Persistence

The persistent data in the Mastodon environment are represented by user posts—which are stored in a PostgreSQL database—and user media/attachments which are stored in an S3-compatible object store.

#### PostgreSQL

We use the Digital Ocean managed SQL database service, this delivers a highly available database backend.
Updates and maintenance are performed by Digital Ocean, independent of our administration efforts.

There is one active PostgreSQL database instance ([Majel](https://memory-alpha.fandom.com/wiki/Majel_Barrett_Roddenberry)) with 2 vCPU and 4GB of memory, with a standby instance ready to take over automatically in the event of system failure.

Digital Ocean instance "T-Shirt" sizes for databases are done by vCPU, memory, disk size, and connections to the database.
The connection count limits are based on sizing best practices for PostgreSQL, with a few held in reserve for their use to manage the service.
Digital Ocean has an integrated "Connection Pool" feature of their platform which, in practice, puts the [pgBouncer](https://www.pgbouncer.org) utility in front of the database.
This acts as a reverse proxy / load balancer for the database, to make sure that connections to the database by Mastodon cannot stay open and consume resources longer than needed.

There are a [few options for pooling modes](https://docs.digitalocean.com/products/databases/postgresql/how-to/manage-connection-pools/#pooling-modes) with Digital Ocean, but the default _Transaction Mode_ is the required option for Mastodon.

Example of `.env.production` configuration settings relevant to PostgreSQL:

```text
# PostgreSQL
DB_HOST=path-to-postgresql-database.ondigitalocean.com
DB_PORT=25061
DB_NAME=the_mastodon_connection_pool
DB_USER=the_mastodon_user
DB_PASS=Ourpassw0rd!sNoneofyourbu$iness
PREPARED_STATEMENTS=false
```

The `PREPARED_STATEMENTS=false` is [required of Mastodon to use pgBouncer](https://docs.joinmastodon.org/admin/scaling/#pgbouncer).
When performing upgrades of Mastodon that require changes to the database schema, you **must** temporarily modify the configuration on the system running the schema change to bypass pgBouncer and go directly to the database.
You will need to remove the line with the prepared statement configuration or set it to true, then change the DB port and DB name values.

#### Object Storage

We use the Digital Ocean Spaces service, which is an S3-compatible object storage provider and includes a content delivery network (CDN) to distribute attached media to multiple points, reducing access latency for users and federated instances.

Example of `.env.production` configuration settings relevant to Digital Ocean Spaces:

```text
# Object Storage
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

Our Spaces is in the Digital Ocean NYC3 data center, which is separate from the rest of the workloads which exist in the TOR1 (Toronto) data center.
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

#### Stunnel Alternatives

There has been discussion within the Mastodon project of replacing the Ruby libraries used to connect to Redis, as the existing code is end of life.
These alternatives include native support for TLS connections, which will negate the need for this component.
We hope to be able to test and integrate these alternatives in the coming months.

### Elastic Search

Mastodon integrates with [Elastic Search](https://www.elastic.co/elasticsearch/) to provide the ability to do full text searching on your posts and any other post that you have directly interacted with, bookmarked, favorited or boosted.

While this is considered an optional component for Mastodon deployments, it is utilized on [vmst.io](https://vmst.io).
We use a dedicated Droplets running [Open Search](https://opensearch.org) 2.5. Open Search is a fork of Elastic Search 7, which was started in 2021.
While it lacks some of the more advanced features found in newer versions of Elastic Search, it is supported by Mastodon.

There are two virtual machines ([Khan](https://memory-alpha.fandom.com/wiki/Khan_Noonien_Singh) and Text) with 1 vCPU and 2GB of memory each. They form a single instance to query, from behind our load balancers.
Together they provide _khantext_.
Get it?

### Translation API

We use the free tier of [DeepL](https://www.deepl.com/translator) as a translation API for our Mastodon Web client interface.
Since the translation feature is not used extensively on [vmst.io](https://vmst.io), we do not plan to go beyond the free tier and begin paying for a different tier, or stand up our own self-hosted translation API, but will evaluate this again in the future should the need arise.

![DeepL Usage](https://cdn.vmst.io/docs/deepl-usage.png)

### SMTP Relay

We use [Mailgun](https://mailgun.com) as our managed SMTP service, used for sending new user sign-up verifications, and other account notifications.

Example of `.env.production` configuration settings relevant to SMTP:

```text
# Mail
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=465
SMTP_LOGIN=gonepostal@sender.vmst.io
SMTP_PASSWORD=nevergonnagiveyouup
SMTP_FROM_ADDRESS='Mastodon <mastodon@sender.vmst.io>'
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

When possible we will run these in a highly available way, behind our security systems and load balancers, but may only be on single backend nodes.
Our Flings leverage much of the existing core service infrastructure like the Nginx reverse proxies and PostgreSQL.
In addition we have the following specific to our Flings:

- One virtual machine ([Uhura](https://memory-alpha.fandom.com/wiki/Nyota_Uhura)) with 2 vCPU and 4 GB of memory.
- MySQL running on one managed instance ([McCoy](https://memory-alpha.fandom.com/wiki/Leonard_McCoy)) with 1 vCPU and 1 GB of memory.

### WriteFreely

WriteFreely is an open source blogging platform written in [Go](https://go.dev).
This hosts our [write.vmst.io](https://write.vmst.io) instance.
It is backed by a single MySQL database instance (McCoy) which was established for this purpose.
We run the native Go application locally on our Fling backend servers.

For more information please refer to our dedicated [Write](/write) documentation.

Our implementation is configured to authenticate against [vmst.io](https://vmst.io), so your Mastodon username and password is a single sign-on to this service.
This is done by creating a client ID and secret with Mastodon.

Example of the WriteFreely `config.ini` relevant to authentication:

```text
[oauth.generic]
client_id          = randomstringofnumbersandlettersgeneratedbyvmstio
client_secret      = wheninthecourseofhumaneventsitbecomesnecessaryto
host               = https://vmst.io
display_name       = Mastodon
callback_proxy     = 
callback_proxy_api = 
token_endpoint     = /oauth/token
inspect_endpoint   = /api/v1/accounts/verify_credentials
auth_endpoint      = /oauth/authorize
scope              = read:accounts
allow_disconnect   = false
map_user_id        = id
map_username       = 
map_display_name   = 
map_email          = 
```

We additionally set `disable_password_auth = true` to **only** allow authentication via Mastodon.
At the moment this prohibits our users from using some types of clients that do not also support OAuth, such as the [writeas-cli](https://github.com/writeas/writeas-cli).
There is an [open request](https://github.com/writefreely/writefreely/discussions/634) with WriteFreely to allow this with out configuration type.

### Matrix

Our Matrix deployment is based on [Synapse](https://matrix.org/docs/projects/server/synapse) server, running in a Docker container from the project's official [Docker Hub image](https://hub.docker.com/r/matrixdotorg/synapse).
Although it is behind our load balancer and multiple reverse proxies, it is currently **not** in a true high availability configuration as it only exists on one Fling backend node.

Our implementation is configured to authenticate against [vmst.io](https://vmst.io), so your Mastodon username and password is a single sign-on to this service.

Example of the Synapse `homeserver.yaml` relevant to authentication:

```text
oidc_providers:
- idp_id: my_mastodon
  idp_name: "Mastodon"
  discover: false
  issuer: "https://vmst.io/@whodoyouthink"
  client_id: "theitsybitsyspiderwentupthewaterspout"  
  client_secret: "downcametherainandwashedthespiderout"
  authorization_endpoint: "https://vmst.io/oauth/authorize"
  token_endpoint: "https://vmst.io/oauth/token"
  userinfo_endpoint: "https://vmst.io/api/v1/accounts/verify_credentials"
  scopes: ["read"]
  user_mapping_provider:
    config:
      subject_claim: "id"

password_config:
    enabled: false
```

_Out came the sun and dried up all the..._ sorry.

### Elk

Elk is an [open source project](https://github.com/elk-zone/elk) to build an alternative web frontend for Mastodon.
It’s in very active development, but is considered “alpha” by their team.

Elk is a node.js application, and we use node.js 19.x as installed on our Fling backend servers.
Our Elk install runs a local complication of the code.

As Elk is very popular among our most active users, and we are also listed on the official project page as an alternative host to their own instance, we seek to run the latest released version Elk components from their upstream projects.

We use a basic bash script, as outlined below, to automatically update our deployment shortly after release.

```bash
cd /path/to/elk
git fetch
git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)
pnpm i
pnpm build
systemctl restart elk-web.service
```

The `elk-web.service` is based off the Mastodon Streaming API service template, with the paths changed to the Elk executable:

```text
WorkingDirectory=/path/to/elk
ExecStart=node .output/server/index.mjs
```

For more information please refer to our original [Elk](/post/2023/01/elk/) announcement.

### Other Sources

Similar to our policy on our core services, we seek to run the latest released version of our Fling components from their upstream projects.
However in some cases we are contributing to the development of these projects, and from time to time may run modified versions to assist with this task.

Our activity level may vary from Fling to Fling with our contributions to the upstream project.

- [Semaphore](https://github.com/NickColley/semaphore)

## Backups

We utilize [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) as our backup provider.

### Database Backups

Posts made to [vmst.io](https://vmst.io) and [write.vmst.io](https://write.vmst.io) are stored in backend databases (PostgreSQL and MySQL) with Redis used as a key value store and timeline cache for [vmst.io](https://vmst.io).

- For the backup of PostgreSQL we use `pg_dump`.
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

- All configuration files for core applications, documentation and Flings are stored on GitHub with changes committed there before being applied to servers.
- Each virtual machine tier has an updated snapshot on Digital Ocean for easy deployment to horizontally scale, or to replace failed systems quickly.

## Documentation

Our documentation website [docs.vmst.io](https://docs.vmst.io) runs on the [Netlify](https://www.netlify.com) app platform.
It is a [Hugo](https://gohugo.io) static website using [a custom version](https://github.com/vmstan/hugo-PaperModXRand) of the the [PaperModX](https://github.com/reorx/hugo-PaperModX) theme called "Rand".
It's automatically generated anytime there is a push event to the [underlying Git repository](https://github.com/vmstan/vmstio).
It uses an integrated CDN provided by Netlify.

There is a [staging version](https://staging-docs.vmst.io) of the documentation, which also generates automatically from pushes to the `staging` branch on GitHub.

If you would like to edit or contribute to the documentation on this site, you may fork the site and submit pull requests to our staging branch.

Please review our [contribution guide](https://github.com/vmstan/vmstio/docs.vmst.io/README.md) for more information.

## Monitoring

We monitor the health and availability of our infrastructure in a few different ways.

### Uptime Kuma

This powers our [status.vmst.io](https://status.vmst.io) page.
It runs on a dedicated VM for this purpose, with its own Nginx frontend.
In addition to providing a page for members to check when there might be issues, it actively alerts our team in our internal [Slack](https://slack.com) to any issues.

![Kuma Alerts](https://cdn.vmst.io/docs/kuma-alert.png)

For more information on this topic please see our [Monitoring](/monitoring) page.

There is one virtual machine ([Kyle](https://memory-alpha.fandom.com/wiki/Kyle)) with 1 vCPU and 2 GB of memory.

### Digital Ocean

We use integrated metrics monitoring available through Digital Ocean to monitor and alert on CPU, memory, disk and other performance metrics of the host virtual machine and managed database systems.
These alerts are sent to our internal Slack.

![Digital Ocean Alerts](https://cdn.vmst.io/docs/do-alert.png)

We also have active monitoring of the worldwide accessibility of our web frontends.
These alerts are sent to our internal Slack and to the email of our server administrators.

### Prometheus & Grafana

We have a self-hosted instance of [Prometheus](https://prometheus.io) which collects metrics from Mastodon via its integrated StatsD system.
[Loki](https://grafana.com/oss/loki/) is additionally used to collect logging from various components such as Nginx.
[Grafana](https://grafana.com/grafana/) is then used to visualize the metrics on dashboards, or to search logs.

![Grafana Screenshot](https://cdn.vmst.io/docs/grafana-screenshot.png)

These dashboards are only used by our team, and are currently not publicly accessible.

## Networking

The local IP space used between systems on our virtual private cloud (VPC) network is issued by Digital Ocean, with static IP addresses that are assigned at creation of the Droplet and persist throughout the lifecycle of the virtual machines.

Where possible, any communication between internal nodes is encrypted even though the communication takes place on the VPC network.

There are a few cases where traffic leaves our VPC but still communicates within the Digital Ocean network, such as when data is moved between Droplets in Toronto and the Object Storage in NYC.

### Public IPs

The public IP addresses assigned to our load balancer and virtual machines are static IP addresses issued and owned by Digital Ocean.
They are assigned at creation and persist throughout the lifecycle of the virtual machine.

status.vmst.io and sites which are behind our load balancer (which is used as the entry point for all traffic) are the only user accessible systems via a public address.

This does not include sites behind any CDN provider which may respond with any variety of addresses which we also do not control.

#### IPv6

At this time none of our systems are accessible via IPv6.
This is due to a [known limitation](https://docs.digitalocean.com/products/networking/load-balancers/details/limits/) of Digital Ocean's managed load balancer service.

As the load balancer is our entry point for all other services, we do not enable IPv6 for Droplets even though it is technically supported.

#### DNS Resolution

We use [DNSimple](https://dnsimple.com/) for our domain registrar and nameserver.
We have DNSSEC enabled on our domain.

## Security

In order to protect our user's privacy and data, we implement a number of different security measures on our systems.

They include:

- Preventing unnecessary external access to systems through OS and service provider firewalls, and limiting communication between internal systems only to the source/destination ports and protocols required for functionality.
- Blocking any access to the system from known problematic networks.
- Leveraging an intrusion detection system to detect and deny access to active bad actors.
- Using updated versions—from trusted sources—of the source code and binaries downloaded to our systems.
- Requiring encrypted connections to all public facing elements, deprecating insecure ciphers, and using secure connections where possible—even on private networks—for communication between internal systems.

### Certificates

We use [Sectigo](https://sectigo.com/) as our primary certificate authority, with the exception of [docs.vmst.io](https://docs.vmst.io) which uses a certificate issued by Cloudflare.

Sectigo was utilized after testing [Let's Encrypt](https://letsencrypt.org/), but the automated validation system presented some challenges for us that were solved by using a legacy commercial CA.

Once our existing wildcard certificate has expired in late 2023, we intend to try again to use Let's Encrypt.

## Command and Control

### Automation

We use the open source [n8n](https://n8n.io/) platform to perform automation tasks and send notifications.
n8n is similar to Zapier, IFTTT, or Power Automate, but can be self-hosted.

n8n connects various APIs from Mastodon, Slack, Matrix, Patreon, Ko-fi, Google, and GitHub.

### People

There is a limited set of people with administrative controls to our core applications and infrastructure.
In the event of a disaster which limits those people from performing their duties, alternatives have been identified to take control of our system and insure continuity of operations.

## Naming Conventions

Our servers are named after characters and actors from the original Star Trek series, and other 23rd century derivatives.

Live long and prosper.
