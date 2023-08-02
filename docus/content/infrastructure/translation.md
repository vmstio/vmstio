---
title: Translation API
---

# Translation API

[LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) is used as translation API for our Mastodon Web and Elk Web client interfaces.

LibreTranslate is a free and open source machine translation API, entirely self-hosted.
Unlike other APIs, it doesn't rely on proprietary providers such as Google or Azure to perform translations.
Instead, its translation engine is powered by the open source Argos Translate library.

We use an instance of LibreTranslate hosted on our internal Kubernetes cluster.
