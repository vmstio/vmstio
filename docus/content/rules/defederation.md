---
title: Defederation
description: Are you a human or a robot?
---

# Defederation

We "defederate" vmst·io from other instances that are incompatible with our fundamental rules, in an effort to protect our users and limit our liability.
The decision to defederate can come from reports by our users but is also based on community discussion around such bad actors, including the periodic import of community maintained blocklists.
We would rather be proactive in blocking bad actors versus waiting for abuse to happen.

We list all defederated instances at [vmst.io/about](https://vmst.io/about), but also periodically post the full listing in CSV format on our GitHub.

:button-link[Download Blocklist]{icon="mdi:file-download-outline" href="https://github.com/vmstan/vmstio/blob/main/domain_blocks.csv" blank}

This list includes domains that may contain offensive language or illegal material, and as a result the domains are marked as sensitive.
Posting the list as a CSV file allows other instance administrators to easily import our blocklist or compare it against their own.

## Blocklist Imports

We believe community maintained blocklists serve an important purpose to help jumpstart the protection of users.

The foundation of our defederation list is the [Oliphant Blocklist](https://codeberg.org/oliphant/blocklists) at [Tier 0](https://codeberg.org/oliphant/blocklists/src/branch/main/blocklists/mastodon/_unified_tier0_blocklist.csv).
We also incorporate the [Tier 1](https://codeberg.org/oliphant/blocklists/src/branch/main/blocklists/mastodon/_unified_tier1_blocklist.csv) list after careful review and application of our local allowlist.

Consensus based lists should have a high number of members to prevent the decisions of one or two administrators from imposing their will on the rest of the Fediverse.
Due to what we perceive as a high number of false positives in the Tier 2 list, with its low consensus threshold, we do not import at that tier.

As part of our import process we perform an activity check on the domain.
If the domain is not currently an ActivityPub endpoint, it is ignored.
We run this import process on a regular basis.
If a previously failed domain in the blocklist come back online, they are incorporated back into our defederation list.

## Reporting

If during your use of the platform, you find another instance that you think needs to be restricted from interacting with ours **or** if you feel that another instance may have been blocked by our staff in error, please file an issue on our [GitHub](https://github.com/vmstan/mastodon/issues/new/choose).
If you'd feel more comfortable, you can also reach out to one or more of our staff directly via private mention or Matrix.

## Threads

Threads, the micro-blogging app from Meta, has announced their intent to implement ActivityPub and join their user base to the rest of the fediverse.

Some Mastodon instances have announced proactive defederation from the `threads.net` domain, and some have gone further and agreed to defederate from any instance that does not also defederate from Threads.

While we are supportive of administrators choosing to disconnect themselves from whatever instances they choose, we would take exception with this second-order level of defederation and consider that harmful to the health of the entire fediverse.

At this time vmst.io does not plan to defederate from Threads, although we may take action to restrict some Threads users or limit some Threads posts from appearing in federated timelines depending on their content, just as we would with any other instance.

### Privacy Implications

Mastodon instances do not broadcast private data like e-mail or IP address you use to other instances.
The software is built on the reasonable assumption that third party servers cannot be trusted.
vmst.io already caches and reprocess images and videos for you to view, so that the originating server cannot get your IP address, browser name, or time of access.
Meta, or any other instance that we federate with, cannot get your private data or track you across the web simply by us being federated with them.

If your Mastodon account is already publicly accessible, search engines and other systems can already index your posted content, if they choose to do so.

### Advertising

Nobody on Mastodon can insert advertising into your user interface, unless you use a third-party client app that is funded that way.
Unless you use Threads, you will not see any ads from Threads.

The Mastodon software does not include any functionality to display ads in the web UI or the official mobile app, and vmst.io will never add the ability to do so as we are not funded by advertising.

It is not possible for any third party server to insert ad-like posts into your home feed, since your home feed is calculated by your own server from the people (and hashtags) that you choose to follow.

If someone you follow makes a sponsored post and you do not want to see it, you can unfollow or mute that person, just as if that other person was on a Mastodon instance.