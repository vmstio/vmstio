---
title: Translation API
---

# Translation API

[LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) is used as translation API for our Mastodon Web and Elk Web client interfaces.

LibreTranslate is a free and open source machine translation API, entirely self-hosted.
Unlike other APIs, it doesn't rely on proprietary providers such as Google or Azure to perform translations.
Instead, its translation engine is powered by the open source Argos Translate library.

We use an instance of LibreTranslate hosted on our internal Kubernetes cluster.

## Available Languages

In order for Mastodon to offer to translate a language, the post must be marked in that language and it must be possible for the translation engine to process.

The following languages should be available:

* Arabic
* Azerbaijani
* Catalan
* Chinese
* Czech
* Danish
* Dutch
* English
* Esperanto
* Finnish
* French
* German
* Greek
* Hebrew
* Hindi
* Hungarian
* Indonesian
* Irish
* Italian
* Japanese
* Korean
* Persian
* Polish
* Portuguese
* Russian
* Slovak
* Spanish
* Swedish
* Turkish
* Ukrainian
