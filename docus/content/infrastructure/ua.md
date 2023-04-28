---
title: User Agents
description: Please identify yourself
---

# User Agents

vmst.io blocks access to applications that do not properly identify themselves with a User Agent string in the header of the request.
This policy helps maintain security and prevent unauthorized access to the platform.

Additionally, we required signed HTTP requests between servers using the ActivityPub protocol.
This is also known as "secure mode" and defined with the `AUTHORIZED_FETCH` variable in Mastodon.
