---
title: iOS Client Options
date: '2022-11-30'
draft: true
description: What client should I use on iOS?
tags:
  - ios
  - clients
---

One of the most common questions that I get, is for guidance on what iPhone client should you be using for Mastodon?

The current state of Mastodon iOS clients means that there isn't _one_ client that implements _all_ of the Mastodon API perfectly, leading many folks to use multiple clients for different purposes. There are also varied degrees of preferences in how some of the apps work for the user. 

In some ways this is refreshing compared to the Birdsite, where your option was use the official client (with all of it's tracking) or a third-party client that is limited in it's ability to interact with the platform.

While this is not an exhaustive list of all the options (new ones are coming all the time) they are ones that [I've](https://vmst.io/@vmstan) personally tested on vmst.io.

This page will be updated as the software referenced is updated, so check back often if you're looking for a new option. Clients not listed here may work fine but haven't been tested. 

If the app hasn't been updated in the last three months it's been specifically excluded. Also the version listed here is only what was used in the evaluation, and does not reflect specific compatibility with the instance, unless otherwise noted.

| **Client** | **Developer**                      | **Code** | **Download** | **Version** |
|------------|------------------------------------|----------|--------------|-------------|
| [Mastodon](/post/2022/11/ios-clients/#mastodon)   | [joinmastodon.org](https://joinmastodon.org)                   | [Open](https://github.com/mastodon/mastodon-ios)     | [App Store](https://apps.apple.com/us/app/mastodon-for-iphone-and-ipad/id1571998974)    | 1.4.7       |
| [Mastoot](/post/2022/11/ios-clients/#mastoot)    | [libei@mastodon.social](https://mastodon.social/@libei)              | Closed   | [App Store](https://apps.apple.com/us/app/mastoot/id1501485410)    | 1.19.1      |
| [Tusker](/post/2022/11/ios-clients/#tusker)     | [shadowfacts@social.shadowfacts.net](https://social.shadowfacts.net/@shadowfacts) | [Open](https://git.shadowfacts.net/shadowfacts/Tusker)     | [TestFlight](https://testflight.apple.com/join/wtB7HYvG)   | 2022.1 (48) |
| [Metatext](/post/2022/11/ios-clients/#metatext)   | [metabolist@mastodon.social](https://mastodon.social/@metabolist)         | [Open](https://github.com/metabolist/metatext)     | [App Store](https://apps.apple.com/us/app/metatext/id1523996615)    | 1.7.1       |
| [tooot](/post/2022/11/ios-clients/#tooot)      | [tooot@xmflsct.com](https://xmflsct.com/@tooot)                  | [Open](https://github.com/tooot-app/app)     | [App Store](https://apps.apple.com/us/app/tooot/id1549772269)    | 4.6.4       |
| [Mammoth](/post/2022/11/ios-clients/#mammoth)    | [JPEGuin@mastodon.social](https://mastodon.social/@JPEGuin)            | Closed   | [TestFlight](https://testflight.apple.com/join/66c1wW8y)   | 1.0 (15)    |
| [Toot!](/post/2022/11/ios-clients/#toot)      | [WAHa_06x36@mastodon.social](https://mastodon.social/@WAHa_06x36)         | Closed   | [App Store](https://apps.apple.com/us/app/toot/id1229021451)    | 17.1        |
| [Ivory](/post/2022/11/ios-clients/#ivory)      | [tapbots@tapbots.social](https://tapbots.social/@tapbots)             | Closed   | n/a          | n/a         |

## Mastodon

The official Mastodon client was launched in 2021. This is where a lot of people land when they hear about Mastodon, because it's the first result that comes up for people when they search for Mastodon in the App Store.

**Advantages**

- Maintained by the same group that writes the core Mastodon code.

**Issues**

- Limited set of options to customize the experience.
- Doesn't let you copy/paste images into the posting field.
- Trending links show up as "News" which is inconsistent with the rest of the platform.
- Local timeline shows up as "Community" (again, inconsistent with web view) and there is no Federated timeline biew.
- No support for uploading animated GIFs.
- No support for editing toots.

## Mastoot

Mastoot feels very clean and adheres to the native iOS design language very well. However it has some major missing features that cause me to use other apps more often than I'd like.

**Advantages**

- Cute icon, with lots of color options.
- Notifications tab can be filtered many different ways.
- Attention to UI details missing from other options.
- Support for editing toots and edit notifications.

**Issues**

- No character count in post screen.
- No custom emoji picker in the compose screen. (Using `:short_codes:` still works.)
- Filtering does not seem to work correctly with Mastodon 4.0.
- Doesn't let you copy/paste images into the posting field.
- It's sometimes slow at refreshing timeline views after launching.

## Tusker

Tusker is an great choice for people who like to turn a lot of knobs and customize their client experiance. It's still in a public beta and only available through Test Flight.

**Advantages**

- Lots of preferences that can be adjusted.
- Supports copy/paste of images into the compose window.

**Issues**

- No push notifications.
- UI needs some polish.
- Missing support for many of Mastodon 4.0 notification types.

## Metatext

Metatext has been the goto client for many users as it has been the best balance of features and design. The future is in question as the developer has stated that due to health issues it will continue only in maintenance mode.

**Advantages**

- Preferences that can be adjusted.
- Implements the most features of any third-party app.

**Issues**

- Uncertain future.
- Recent versions generate a lot of random error messages on launch.
- No support for editing toots, does have "Delete & Redraft" option.

## tooot

tooot is actually the only option here that is available on both iOS and Android.

**Advantages**

- Really leans into the toots.
- Notifications tab can be filtered many different ways.

**Issues**

- Dark mode doesn't have a "true black" background -- it's just really dark gray.
- No support for trending features.
- UI is very text driven.

## Mammoth

Mammoth is being built by the developer of Mast, who is also the developer of the Birdsite app Aviary.

**Advantages**

- Based on the skeleton of the app right now, it's going to have a lot of customization options.
- Based on the skeleton of the app right now, it's going to have a lot of features.

**Issues**

- This is a *very* beta app, and large sections like DMs and Notifications just don't work yet.

Overall this is an app to install and monitor the progress, but cannot be recommended for everyday use.

## Toot!

Toot is a *very* opinionated app, with a lot of custom animations. Just try it and see what you think.

## Ivory

Ivory was an open secret up until recently when the Tapbots team officially announced it was in development. Tapbots is the developer of the fantastically popular Birdsite app Tweetbot, and much of the design and code will be shared between the two. There's nothing to review here, because there's no app in the wild, but given the history of Tapbots there's a good reason to believe it will be a "killer" app for Mastodon.
