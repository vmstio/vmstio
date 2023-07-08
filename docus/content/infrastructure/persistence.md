---
title: Persistence 
---

# Persistence

The persistent data in the Mastodon environment are represented by user posts—which are stored in a PostgreSQL database—and user media/attachments which are stored in an S3-compatible object store.

## PostgreSQL

[PostgreSQL](https://www.postgresql.org), often referred to as Postgres, is an open-source relational database management system.
In Mastodon, it is used as the primary database to store and manage various types of data required for the functioning of the platform
Postgres plays a crucial role in Mastodon's architecture, providing persistence, data integrity, and efficient querying capabilities.

Here are some ways Postgres is used in Mastodon:

- User data storage: Postgres stores user account information, such as usernames, email addresses, profile details, and encrypted passwords. This data is essential for user authentication, authorization, and managing user profiles.
- Content storage: Mastodon stores user-generated content, such as statuses (toots), replies, favorites, and media attachments, in Postgres. It also keeps track of relationships between these entities, such as which user authored a particular toot or which toots are part of a conversation thread.
- Metadata storage: Mastodon stores metadata related to the platform's functioning, including instance information, blocked instances, and domain-level configurations, in Postgres. This information is used for managing the federated nature of the network.
- Social graph management: Postgres is used to store and manage the social graph, which consists of relationships between users, such as followers and followings, mute and block lists, and group memberships.

We use the Digital Ocean managed PostgresSQL database service, this delivers a highly available database backend.
Updates and maintenance are performed by Digital Ocean, independent of our administration efforts.

There is one active PostgreSQL database instance ([Majel](https://memory-alpha.fandom.com/wiki/Majel_Barrett_Roddenberry)) with 4 vCPU and 8GB of memory, with a standby instance ready to take over automatically in the event of system failure.
We use PostgreSQL 15.x.

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

## Object Storage

Object storage is a scalable and cost-effective storage solution that is used in Mastodon to store and manage large volumes of unstructured data, such as media files (images, videos, and audio) and static assets.
In Mastodon, object storage plays a crucial role in efficiently handling and serving user-uploaded media content.

Here's how object storage is used in Mastodon:

- Media uploads: When users upload media files, such as images or videos, to Mastodon, these files are stored in object storage. These storage systems provide high availability, durability, and scalability, ensuring that the uploaded media is securely stored and accessible when needed.
- Media processing: After the media files are uploaded, Mastodon performs various processing tasks, such as resizing images, creating thumbnails, and transcoding videos. The processed files are then stored back into the object storage for serving to users.
- Content delivery: Mastodon serves the media content stored in object storage directly to users. Object storage systems typically support content delivery through URLs, which can be used by Mastodon to embed media files in toots or serve them through media previews. This ensures that the media content is efficiently served to users without overloading the Mastodon application server.
- Cache and CDN integration: Object storage systems often support integration with content delivery networks (CDNs) to improve the performance of media delivery. Mastodon can leverage this integration to cache and distribute media content to users from a CDN, reducing the load on the object storage system and improving the user experience.

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
CDN_HOST=https://assets.vmst.io
```

Our Spaces is in the Digital Ocean NYC3 data center, which is separate from the rest of the workloads which exist in the TOR1 (Toronto) data center.
By default, the items in the Space are accessible through a non-CDN accessible endpoint, but once that is created on the Digital Ocean side, is set in Mastodon by using the `S3_ALIAS_HOST` variable.

## Redis

[Redis](https://redis.io) is an open-source, in-memory data structure store that is used as a database, cache, and message broker. In Mastodon, Redis is used for various purposes to improve the performance, scalability, and reliability of the platform.

We use the Digital Ocean managed Redis database service, this delivers a highly available database backend. Our primary Redis instances has 1 vCPU and 2GB of memory running Redis 7.x.

Our connection to Redis is configured as a `REDIS_URL` variable using a connection string.

```text
REDIS_URL=rediss://default:password@redis.db.ondigitalocean.com:25061
```

Note that the second `s` in `rediss` is not a typo and is used for TLS connections only.
