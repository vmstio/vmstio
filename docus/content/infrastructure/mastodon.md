---
title: Mastodon
---

# Mastodon

Aside from the various external dependencies, Mastodon is three main applications:

- Web UI & API
- Streaming API
- Sidekiq

## Web

The Mastodon Web tier consists of the Mastodon Web UI/API and the separate Streaming API service.
Our Web tier runs on the Digital Ocean managed Kubernetes platform.

### Puma

What users perceive as "Mastodon" is a [Ruby on Rails](https://rubyonrails.org) and [React](https://react.dev) application (with [Puma](https://puma.io) running as the web/presentation layer) providing both ActivityPub/Federation and the web user experience.
We use Ruby 3.2 and the other modules that are part of the standard [Dockerfile](https://github.com/mastodon/mastodon/blob/main/Dockerfile) build of Mastodon.

Based on recommendations by the developer of Puma, and others in the Mastodon administration community, we have Puma configured in `.env.production` and as follows:

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

### Streaming

The Streaming API is a separate [node.js](https://nodejs.org/en/) application which provides a background WebSockets connection between your browser session and the Mastodon server to provide real-time "streaming" updates as new posts are loaded to your timeline, to send notifications, etc.

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
