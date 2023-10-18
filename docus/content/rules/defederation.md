---
title: Defederation
description: Are you a human or a robot?
---

# Defederation

We "defederate" vmst·io from other instances that are incompatible with our fundamental rules, in an effort to protect our users and limit our liability.
The decision to defederate can come from reports by our users but is also based on community discussion around such bad actors, including the periodic import of community maintained blocklists.
We would rather be proactive in blocking bad actors versus waiting for abuse to happen.

## Export

We list all defederated instances at [vmst.io/about](https://vmst.io/about), but also periodically post the full listing in CSV format on our GitHub.

:button-link[Download Blocklist]{icon="mdi:file-download-outline" href="https://github.com/vmstan/vmstio/blob/main/domain_blocks.csv" blank}

Posting the list as a CSV file allows other instance administrators to easily import our blocklist or compare it against their own.

### Sensitivity

Our defederated instance list includes domains where the name itself may contain offensive language, or the resulting site contains harmful or illegal materials. As a result the domains are partially redacted when viewing on the [vmst.io/about](https://vmst.io/about) listing.

However, in order to import our list into your own, these domain names are listed on GitHub.

::alert{type="warning"}
When you view this list or visit these sites you do so at your own discretion and/or liability.
::

## Imports

We believe community maintained blocklists serve an important purpose to help jump start instances in providing protection to users from abusive or disruptive individuals.

We choose to use extremely high-consensus threshold lists for our suspension (blocked) list to prevent breaking connections from users unnecessarily.
We have a lower threshold for importing limitation (muted) lists as these changes can be undone without breaking user connections.

### Sources

Suspension Sources:

- [Oliphant Birdsites](https://codeberg.org/oliphant/blocklists/raw/branch/main/blocklists/mastodon/birdsite.csv)
- [Oliphant 100%](https://codeberg.org/oliphant/blocklists/raw/branch/main/blocklists/mastodon/100.percent.csv)
- [Seridy Tier 0](https://seirdy.one/pb/tier0.csv)
- [Gardenfence Tier 0](https://raw.githubusercontent.com/gardenfence/blocklist/main/gardenfence-mastodon.csv)

Limitation Sources:

- [Oliphant Tier 1](https://codeberg.org/oliphant/blocklists/raw/branch/main/blocklists/mastodon/_unified_tier1_blocklist.csv)

_Limitations are processed after suspensions, so if a site appears in multiple sources the more restrictive tier is applied._

Import Filtering:

- As part of our import process we perform an activity check on the domain, if the domain is not currently an ActivityPub endpoint, it is ignored.
- We run this import process on a regular basis, so if a previously failed domain in the blocklist come back online, they are incorporated back into our defederation list.
- We do not import changes to the status of any instance that would suspend another member of the [joinmastodon.org](https://joinmastodon.org) [Server Covenant](/about/covenant), because we believe in allowing portability between member instances, although they can be automatically limited.
- We maintain an internal list of allowed instances that might be automatically limited by importing the raw source list, with rare exception this only applies to the limitation sources.
- Exceptions to this process may made on a case by case basis.

![Import Diagram](/blocksync.png)

## Reporting

If during your use of the platform, you find another instance that you think needs to be restricted from interacting with ours **or** if you feel that another instance may have been blocked by our staff in error, please file an issue on our [GitHub](https://github.com/vmstan/mastodon/issues/new/choose).
If you'd feel more comfortable, you can also reach out to one or more of our staff directly via private mention.

## Threads

Threads, the micro-blogging app from Meta, has announced their intent to implement ActivityPub and join their user base to the rest of the Fediverse.

Some Mastodon instances have announced proactive defederation from the `threads.net` domain, and some have gone further and agreed to defederate from any instance that does not also defederate from Threads.

While we are supportive of administrators choosing to disconnect themselves from whatever instances they choose, we would take exception with this second-order level of defederation and consider that harmful to the health of the entire Fediverse.

At this time vmst.io does not plan to defederate from Threads, although we may take action to restrict some Threads users or limit some Threads posts from appearing in federated timelines depending on their content, just as we would with any other instance.

### Privacy Implications

Mastodon instances do not broadcast private data like e-mail or the IP address you use to other instances.
The software is built on the reasonable assumption that third party servers cannot be trusted.

vmst.io servers download, process and cache images and videos for you to view. Not only is this more efficient when multiple users want to view the same content from another instance, it helps to preserve your privacy by acting as a proxy to that resource. Unless you choose to click through to the source content the originating server cannot get your IP address, browser name, or time of access.

Meta, or any other instance that we federate with, cannot fingerprint or use other private data or track you across the web simply by us being federated with them.

Some folks are concerned that content posted on their instance will be federated to Meta when someone using Threads follows them, allowing Meta to index that content.
While this is a valid concern, Mastodon provides controls for individual users to block any domain they choose, so if this is a concern you can defederate yourself from Threads at any time while remaining a member of vmst.io.
However, if your Mastodon account page (ex: [https://vmst.io/@vmstan](https://vmst.io/@vmstan)) is already publicly accessible, search engines and other systems can already index your posted content.

### Advertising

Nobody on Mastodon can insert advertising into your user interface, unless you use a third-party client app that is funded that way.
Unless you use Threads, you will not see any ads from Threads.

The Mastodon software does not include any functionality to display ads in the web UI or the official mobile app, and vmst.io will never add the ability to do so as we are not funded by advertising.

It is not possible for any third party server to insert ad-like posts into your home feed, since your home feed is calculated by your own server from the people (and hashtags) that you choose to follow.

If someone you follow makes a sponsored post and you do not want to see it, you can unfollow or mute that person, just as if that other person was on a Mastodon instance.
