---
title: Search
---

# Full Text Search

Mastodon integrates with [Elastic Search](https://www.elastic.co/elasticsearch/) to provide the ability to do full text searching on:

- User profiles known to our instance, including their bio information
- Trending hashtags
- **Your** posts
- Replies to **your** posts
- Any other post that **you** have directly interacted with (bookmarked, favorited or boosted)

![John Mastodon Example Search](https://cdn.vmst.io/docs/john-mastodon.jpg)

While this is considered an optional component for Mastodon deployments, it is utilized on [vmst.io](https://vmst.io).
We use a Elastic Search 7.x running on our Kubernetes cluster.

## Search Limitations

The current implementation of Full Text Search in Mastodon is highly restricted in what it allows to be indexed and returned for you.
As outlined above, only posts that you have interacted with are returned during search.

Mastodon, the project, is working on code changes that will come in a future update to allow more open ended searching, but it hasn’t been merged yet.
There are legitimate concerns about user consent and misusing of the search function, so they're working on building additional flags into posts to indicate that a user opts-in to having their content indexed and discoverable.

Some instances have side-stepped some of the privacy concerns and implemented an enhanced full text search on their own already, while other projects and forks have done so in their own ways.
Mastodon is attempting to be thoughtful and thorough in their implementation.

## Example Configuration

Example of `.env.production` configuration settings relevant to Elastic Cloud:

```text
ES_ENABLED=true
ES_HOST=https://search.target
ES_PORT=443
ES_USER=elastic
ES_PASS=StretchArmstrong
```

When pointing at an Elastic Search or OpenSearch endpoint using TLS it is necessary that `ES_HOST` include the full `https://` address.
