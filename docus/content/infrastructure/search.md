---
title: Search
---

# Full Text Search

Mastodon integrates with [Elastic Search](https://www.elastic.co/elasticsearch/) to provide the ability to do full text searching on:

- User profiles known to our instance
- Trending hashtags
- **Your** posts
- Replies to **your** posts
- Any other post that **you** have directly interacted with (bookmarked, favorited or boosted)

![John Mastodon Example Search](https://cdn.vmst.io/docs/john-mastodon.jpg)

While this is considered an optional component for Mastodon deployments, it is utilized on [vmst.io](https://vmst.io).
We use a managed instance of OpenSearch 2.x running on Amazon Web Services.
[OpenSearch](https://opensearch.org) is a fork of the Elastic Search 7.x code.

There are two data nodes, with 2 vCPU and 2GB of memory each. They form a single instance to query.

Example of `.env.production` configuration settings relevant to Elastic Cloud:

```text
ES_ENABLED=true
ES_HOST=https://search.target
ES_PORT=443
ES_USER=elastic
ES_PASS=StretchArmstrong
```

When pointing at an Elastic Search or OpenSearch endpoint using TLS it is necessary that `ES_HOST` include the full `https://` address.
