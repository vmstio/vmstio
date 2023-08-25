---
title: Search
---

# Search

Search in Mastodon, and the wider Fediverse, can be a confusing and contentious topic.

By default, Mastodon only performs searches against posts which contain hashtags, using data stored in the primary Postgres database.
Anything that is posted with a hashtag is also federated and discoverable by searching for that hashtag.

If an administrator chooses to implement it, Mastodon can integrate with [Elastic Search](https://www.elastic.co/elasticsearch/) or [OpenSearch](https://opensearch.org) to provide the ability to do additional searching on:

- Users known to the instance (including their profile information)
- Trending hashtags
- Full text search of **your own** posts (including alt-text data)
- Full text search of replies to **your own** posts
- Any other post that **you** have directly interacted with (bookmarked, marked as a favorite, or boosted)

![John Mastodon Example Search](/john-mastodon.jpg)

While this is considered an optional component for Mastodon deployments, it is utilized on [vmst.io](https://vmst.io).
We use a multi-node Elastic Search 7.x implementation running on our Kubernetes cluster.

## Opt-In Indexing

Starting in Mastodon 4.2, full text search will also include posts for anyone who opts-in to letting their own instance, and other Mastodon instances, return any full text search results for their posts.

![Indexable](/indexable.png)

This opt-in process can be done in Preferences > [Privacy & Reach](https://vmst.io/settings/privacy) under "Include posts in search results."

The decision to opt-in or out of this feature does not impact the ability of users to see your posts using a standard hashtag search, or other full text searching where they have previously interacted with your post, as outlined above.

If you opt-in to full indexing and later decide you no longer want to participate, you're free to change this setting.

Any changes to this setting take effect instantly for local members doing searches against your account, but may take time for the change to federate out to other instances.
Like any other profile update, the changes are queued to immediately be sent to other servers but for any number of reasons may fail to be received by all instances.
Mastodon does additional polling of remote user profiles to make sure the `indexable` flag and other profile data is up-to-date.

### Per Post Out-Out

If you have opted your account into full indexing, but wish to not have an individual post discoverable, you can opt that post out by setting the post visibility to "Unlisted" instead of public.

Follower only and private mentions are also not discoverable to other users.

## Opt-Out Profile Discovery

Users can also opt-out of their profile biographical information being returned in search results, by visiting the Preferences > [Privacy & Reach](https://vmst.io/settings/privacy) under "Feature profile and posts in discovery algorithms."

![Discoverable](/discoverable.png)

Changing this setting is not recommended.

## Unauthorized Indexing

The `discoverable` and `indexable` settings are federated to other Mastodon instances running version 4.2 beta 2 or higher, as well as other Fediverse software platforms that are programmed to recognize this setting.
The Mastodon project carefully considers and debates the implementation of features like search with a goal of providing for user consent while avoiding misuse.

However, some Mastodon instances have side-stepped some of the privacy concerns and previously implemented an enhanced full text search which does not currently respect this `indexable` flag, while other Fediverse projects and forks have done so in their own ways.

vmst.io has limited controls over how other federated platforms index your posts.

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
- before:2023-08-21
- after:2023-08-08

You can combine the search parameters.

For example, to see all indexed posts which mention the phrase `John Mastodon` AND include an image posted after August 1, use the following search: `'John Mastodon' has:image after:2023-08-01`

As this feature is further developed, more modifiers may become available.
Also, adding multiple modifiers together as shown above will work, but using operators like `AND`, `NOT`, and `OR` are currently not supported.
