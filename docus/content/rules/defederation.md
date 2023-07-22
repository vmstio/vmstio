---
title: Defederation
description: Are you a human or a robot?
---

# Defederation

We "defederate" vmst·io from other instances that are incompatible with our fundamental rules, in an effort to protect our users and limit our liability.
The decision to defederate can come from reports by our users but is also based on community discussion around such bad actors, including the perodic import of community maintained blocklists.
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
If you'd feel more comfortable, you can also reach out to one or more of our staff directly via direct message.