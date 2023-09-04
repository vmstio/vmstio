---
title: Search
---

# Search

Search in Mastodon, and the wider Fediverse, can be a confusing and contentious topic.

There are two levels of search supported by Mastodon:

- Basic Search
- Full Text Search

The availability of the more advanced full text searching depends on if your instance has implemented additional indexing infrastructure.

## Basic Search

By default, Mastodon only performs hashtag searches against posts, using data stored in the primary Postgres database.
Including a hashtag in your post makes that post indexable by anyone else who performs a search for that hashtag.
Anything that is posted with a hashtag is also federated and discoverable by searching for that hashtag on any other instance.

Basic search also provides limited searching against user names for folks where the instance already has awareness of their account.

## Full Text Search

If an administrator chooses to implement it, Mastodon can integrate with [Elasticsearch](https://www.elastic.co/elasticsearch/) or [OpenSearch](https://opensearch.org) to provide the ability to do additional searching on:

- Users profile information (unless they opt-out)
- Full text search of **your own** posts (including alt-text data)
- Full text search of replies to **your own** posts
- Any other post that **you** have directly interacted with (bookmarked, marked as a favorite, or boosted)
- Starting in Mastodon 4.2, **any post** from users who **opt-in** to full text search indexing.

![John Mastodon Example Search](/john-mastodon.jpg)

While this is considered an optional component for Mastodon deployments, it is utilized on [vmst.io](https://vmst.io).
We use a multi-node Elasticsearch 7.x implementation running on our Kubernetes cluster.

_How will I know if full text searching is enabled on my instance?_

When you start searching, the dropdown will say "Posts matching ..." your term.
If you don't see this, full text searching is not enabled.

![](/no-es-search.png)

### Opt-In Indexing

Starting in Mastodon 4.2, full text search will also include posts for anyone who opts-in to letting their own instance, and other Mastodon instances, return any full text search results for their posts.

![Indexable](/indexable.png)

This opt-in process can be done in Preferences > [Privacy & Reach](https://vmst.io/settings/privacy) under "Include posts in search results."

The decision to opt-in or out of this feature does not impact the ability of users to see your posts using a standard hashtag search, or other full text searching where they have previously interacted with your post, as outlined above. Your decision also does not impact your ability to perform full text searching for other people's content, or your own.

Your own data is always available to you regardless of other people's ability to search for it.

If you opt-in to full indexing and later decide you no longer want to participate, you're free to change this setting.

Any changes to this setting take effect instantly for local members doing searches against your account, but may take time for the change to federate out to other instances.
Like any other profile update, the changes are queued to immediately be sent to other servers but for any number of reasons may fail to be received by all instances.
Mastodon does additional polling of remote user profiles to make sure the `indexable` flag and other profile data is up-to-date.

### Per Post Opt-Out

If you have opted your account into full indexing, but wish to not have an individual post discoverable, you can opt that post out by setting the post visibility to "Unlisted" instead of public.

Follower only and private mentions are also not discoverable to other users.

### Opt-Out Profile Discovery

Users can also opt-out of their profile biographical information being returned in search results, by visiting the Preferences > [Privacy & Reach](https://vmst.io/settings/privacy) under "Feature profile and posts in discovery algorithms."

![Discoverable](/discoverable.png)

Changing this setting is not recommended.

### Unauthorized Indexing

The `discoverable` and `indexable` settings are federated to other Mastodon instances running version 4.2 beta 2 or higher, as well as other Fediverse software platforms that are programmed to recognize this setting.
The Mastodon project carefully considers and debates the implementation of features like search with a goal of providing for user consent while avoiding misuse.

However, some Mastodon instances have side-stepped some of the privacy concerns and previously implemented an enhanced full text search which does not currently respect this `indexable` flag, while other Fediverse projects and forks have done so in their own ways.

vmst.io has limited controls over how other federated platforms index your posts.

## Search Modifiers

The following search modifiers are available as of Mastodon 4.2:

| Operator        | Modifies search to                                                   |
|-----------------|----------------------------------------------------------------------|
| `from:me`       | Posts you've made                                                    |
| `in:library`    | Posts you have previously interacted with (favorite/boost)           |
| `from:username` | Posts from a specific user                                           |
| `has:image`     | Posts that include an image                                          |
| `has:video`     | Posts that include a video                                           |
| `has:audio`     | Posts that include audio                                             |
| `has:media`     | Posts that include any media                                         |
| `has:poll`      | Posts that have a poll                                               |
| `has:link`      | Posts that have a link                                               |
| `has:embed`     | Posts that have embedded content                                     |

As this feature is further developed, more modifiers may become available.

### Operators

- To exclude content using from a modifier, include a `-` operator as part of the search. For example, `-has:media` would exclude any post that includes media attachments.
- When you include multiple search terms or modifiers together, there is a hidden `AND` between each component.
- There is currently not an `OR` type operator.
- To search for a specific multi-word phrase, put the term in single or double quotes like `'Search Term'` or `"Search Term"`

#### Examples

- Searching for `Star Wars` will return posts that contain both the word `Star` and `Wars` but not necessarily `Star Wars`.
- Searching for `"Star Wars"` will only return posts that contain the combined phrase.
- To see all indexed posts which mention the phrase `John Mastodon` AND include an image posted before August 1, use the following search: `'John Mastodon' has:image before:2023-08-01`
- To see all indexed posts for Star Trek that include images but exclude SNW to avoid spoilers, for example, use `'Star Trek' has:image -SNW`
- To see posts from [@vmstan] that mention VMware but exclude any replies, use `from:vmstan -is:reply VMware`