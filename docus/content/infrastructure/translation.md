---
title: Translation API
---

# Translation API

We use two different translation APIs.

## DeepL

We use the free tier of [DeepL](https://www.deepl.com/translator) as a translation API for our Mastodon Web client interface.

Since the translation feature is not used extensively on [vmst.io](https://vmst.io), we do not plan to go beyond the free tier and begin paying for a different tier, or stand up our own self-hosted translation API, but will evaluate this again in the future should the need arise.

## LibreTranslate

[LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) is used as translation API for our Elk Web client interface.

LibreTranslate is a free and open source machine translation API, entirely self-hosted. Unlike other APIs, it doesn't rely on proprietary providers such as Google or Azure to perform translations. Instead, its translation engine is powered by the open source Argos Translate library.

It is accessible as a standalone application at [https://translate.vmst.io](https://translate.vmst.io), and is hosted on our Kubernetes cluster.
