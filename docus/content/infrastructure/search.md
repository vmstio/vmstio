---
title: Search
---

# Search

Search in Mastodon, and the wider Fediverse, can be a confusing and contentious topic.

By default, Mastodon only performs searches against posts which contain hashtags, using data stored in the primary Postgres database.
Anything that is posted with a hashtag is also federated and discoverable by searching for that hashtag.

If an administrator chooses to implement it, Mastodon can integrate with [Elastic Search](https://www.elastic.co/elasticsearch/) or [OpenSearch](https://opensearch.org) to provide the ability to do additional searching on:

- User profiles known to our instance, including their bio information
- Trending hashtags
- Full text search of **your** posts
- Full text search of replies to **your** posts
- Any other post that **you** have directly interacted with (bookmarked, marked as a favorite, or boosted)

![John Mastodon Example Search](/john-mastodon.jpg)

While this is considered an optional component for Mastodon deployments, it is utilized on [vmst.io](https://vmst.io).
We use a Elastic Search 7.x running on our Kubernetes cluster.

## Opt-In Indexing

Starting in Mastodon 4.2, full text search will also include posts for anyone who opts-in to letting their own instance, and other Mastodon instances, return any full text search results for their posts.

![Indexable](/indexable.png)

This opt-in process can be done in Preferences > [Privacy & Reach](https://vmst.io/settings/privacy) under "Include posts in search results."

The decision to opt-in or out of this feature does not impact the ability of users to see your posts using a standard hashtag search, or other full text searching where they have previously interacted with your post, as outlined above.

### Unauthorized Indexing

The `indexable` setting is federated to other Mastodon instances running version 4.2 beta 2 or higher, as well as other Fediverse software platforms that are programmed to recognize this setting.
After vigorous debate, the Mastodon project, works to be thoughtful in it's implementation of features like search to provide user consent and avoid misuse.

However, some Mastodon instances have side-stepped some of the privacy concerns and previously implemented an enhanced full text search which does not currently respect this `indexable` flag, while other Fediverse projects and forks have done so in their own ways.

vmst.io cannot completely control how your posts are indexed by other federated platforms.

## Search Modifiers

The following search modifiers are available as of Mastodon 4.2:

- from:username
- has:image
- has:video
- has:audio
- has:media
- has:poll
- has:link
- has:embed
- is:sensitive
- is:reply
- language:en
- before:2023-08-08
- after:2023-08-08
- during:2023-08-08

These can be combined, for example if you want to see all indexed posts which mention the full term "John Mastodon" but also include an image, after August 1, you can search for `'John Mastodon' has:image after:2023-08-01` to refine your results.