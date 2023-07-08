---
title: Translation API
---

# Translation API

We use [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) as a translation API for our Mastodon Web client interface.

LibreTranslate is a free and open source machine translation API, entirely self-hosted. Unlike other APIs, it doesn't rely on proprietary providers such as Google or Azure to perform translations. Instead, its translation engine is powered by the open source Argos Translate library.

It is accessible as a standalone application at [https://translate.vmst.io](https://translate.vmst.io), and is hosted on our Kubernetes cluster.
