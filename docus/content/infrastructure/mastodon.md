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

Our Puma pods are set to scale with Kubernetes and within Puma itself. We have Puma configured in `.env.production` and as follows:

```text
WEB_CONCURRENCY=2
MAX_THREADS=8
```

Puma mainly provides the API interface for client applications, and the HTML skeleton of the WebUI.
Static files such as interface images, cascading style-sheets (CSS) and JavaScript which make up the Mastodon WebUI are served from a CDN at [assets.vmst.io](https://assets.vmst.io/oops.gif) to provide folks around the world a much faster copy when loading the site.

Previously they were served directly from our core servers, which being in Canada might be slower to load for those folks on the other side of the world.

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
