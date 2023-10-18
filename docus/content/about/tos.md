---
title: Terms of Service
---

# Terms of Service

These terms describe how the Mastodon instance vmst.io collects, protects and uses the personally identifiable information you may provide through the vmst.io website or its API.
The policy also describes the choices available to you regarding our use of your personal information and how you can access and update this information.

This policy does not apply to the practices of companies that vmst.io does not own or control, or to individuals that vmst.io does not employ or manage.

## Changelog

- [October 18, 2023](https://github.com/vmstan/vmstio/pull/81)
- [August 17, 2023](https://github.com/vmstan/vmstio/pull/71)
- [July 25, 2023](https://github.com/vmstan/vmstio/commit/37cf880f12a23c2799bf9a8a735a90176e43b0c2#diff-ae85e39155eb0b9c9e8d944a2c038561b24c3c3b65d26c27d0c1aaa317f5ed5b)
- [July 5, 2023](https://github.com/vmstan/vmstio/commit/65d8330996010ddb283fe2026ed03979ef68cbc9#diff-ae85e39155eb0b9c9e8d944a2c038561b24c3c3b65d26c27d0c1aaa317f5ed5b)

## Definitions

Definitions of various terms used throughout this document:

| Term        | Definition                                                                                                                                   |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Instance    | Mastodon or other ActivityPub-protocol compatible software installed under a single domain which is configured to accept and relay posts between other systems. |
| API         | Application programming interface, a way for two or more computer programs to communicate with each other. |
| Federation  | Instance to instance communication, passing posts and other user data back and forth via an API. |
| Database    | The system/location dedicated to storage of user data submitted through our website, via an API or from another client application. |
| Media Store | The system/location dedicated to storage of images, video, audio or other attachments submitted through our website, via an API or from another client application. |

## System Functionality

### Basic account information

- If you register on this instance, you will be asked to enter a username, an e-mail address and a password.
- You may also enter additional profile information such as a display name, biography, links, upload a profile picture and/or header image.
- Your username, display name, biography, links, profile picture and header image are always listed publicly.

### Social graph

- By default, your social graph is listed publicly, but this may be disabled in your account settings.
- You may follow other people to view their combined posts in your own personalized home timeline.
- By default, anyone may follow posts made by your account. You may toggle an option to approve and reject new followers manually in your account settings.
- You can only interact with other people's content and post your own content when you are logged in.

### Post visibility and delivery

- When you submit a post, the date and time is stored as well as the application you submitted the post from. Posts may optionally contain media attachments, such as pictures and videos.
- Your posts are delivered to your local followers, as well as other federated instances and copies are stored there. Due to circumstances outside out control we cannot guarantee that all federated instances will receive or process the your post.
- When you delete posts, they are removed from the local database and a deletion request is sent to federated instances that may contain that data. Due to circumstances outside out control we cannot guarantee that all federated instances will receive or process the deletion.
- All completed posts are stored and processed in the instance database.
- There is no instance-side draft functionality nor does the instance save data from uncompleted posts to the database.
- Your browser or third-party client application may store uncompleted copies of posts in a cache or as a feature of the application, separately from our database and outside of these terms.

#### Public and unlisted content

- Public posts are visible to anyone who visits your profile page, to all your followers, as well as anyone viewing the Local or Federated timelines.
- Unlisted posts are visible to anyone who visits your profile page, and to all your followers, therefore both public and unlisted posts are available publicly.
- The action of boosting or liking another post is always public.
- When you pin/feature a post on your profile, that is also publicly available information.

#### Private mentions and followers-only posts

- Followers-only posts are delivered to your followers and users who are mentioned in them, and Private mention posts are delivered only to users mentioned in them.
- We make a good faith effort to limit the access to those posts only to authorized persons, but other instances may fail to do so.

Please keep in mind that it is technically possible for the operators of the instance and any receiving instance to view such messages, and that recipients may screenshot, copy or otherwise re-share them.

## IPs and Other Metadata

When you log in, we record the IP address you log in from, as well as the User Agent of your browser or application.
All the logged in sessions are available for your review and revocation in the settings.

Any of the information we collect from you may be used in the following ways:

- To provide the core functionality of Mastodon as defined above.
- To aid moderation of the community, for example comparing your IP address with other known ones to determine ban evasion or other violations.
- To troubleshoot issues with the service, either reported by you or observed by our administrators.
- The email address you provide may be used to send you information, notifications about other people interacting with your content or sending you messages, respond to inquiries, and/or other requests or questions.

Your latest IP address used is stored in our database for up to 12 months.

### How do we protect your information?

We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.

Among other things, your browser session, as well as the traffic between your applications and the API, are secured with TLS, and your password is hashed using a strong one-way algorithm.
You should enable two-factor authentication to further secure access to your account.

### What is our data retention policy?

We do not automatically delete data uploaded by our instance users on any regular basis, however you may individually [schedule regular deletions](https://vmst.io/statuses_cleanup) of your previous posts.

In order to minimize the growth of our database, we periodically purge remote user posts older than 90 days which has been received through federation (either directly or via relay) but have not been interacted with by a local user during that time.
We also periodically purge media store data (images, videos, etc) from remote user posts that are older than 7 days, but this data may be retrieved on demand by our systems if requested again after this time period.

#### Account deletion requests

You may irreversibly [delete your account](https://docs.joinmastodon.org/user/moving/#delete) and your data at anytime.

When you delete your account, it is completely removed from the local database and a deletion request is sent to all federated instances that may be aware of your account.

- Due to the decentralized nature of Mastodon and other circumstances outside out control, we cannot guarantee that all federated instances will receive or process the deletion.
- If you have concerns that another instance may still be holding your data after the completion of a deletion request, you will need to contact the administrators of that instance relevant to their policies.

We will make a good faith effort to automatically process all remote account deletion requests as they are received.
In order to make sure we are not holding on to user accounts for remote users when it's no longer appropriate, we also periodically purge user data from remote instances where the account is no longer available or accessible, or for instances which we have chosen to no longer participate in federation.

If you are a member of a remote instance and would like your user data removed from our database or media stores, please contact one of our administrators.

#### System backups

Your data may remain in backups of our infrastructure for up to 7 days beyond any request to delete it from production.

#### Backup and exporting data

In addition to regular backups we make of our infrastructure, you can backup your data and [export it](https://docs.joinmastodon.org/user/moving/#export) at any time.

Such exports will include archive of your content, including:

- Your posts
- Media attachments
- Your profile picture
- Your header image
- Who you follow
- Who you block or mute
- Lists you've created
- Bookmarks you've made

You may backup and export your data once every seven days, without then deleting or moving your account.
To prevent abuse, followers cannot be exported without completing a user account migration to another Mastodon-compatible instance.

### Do we use cookies?

Yes.

Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow).
These cookies enable the site to recognize your browser and, if you have a registered account, associate it with your registered account.
We use cookies to understand and save your preferences for future visits.

### Do we disclose any information to outside parties?

We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
This does not include trusted third parties who assist us in operating our site, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
We may also release your information when we believe release is appropriate to comply with valid legal requests, enforce our site policies, or protect the rights, property, or safety of ourselves and others.

Your public content may be downloaded by other instances in the network.
Your public and followers-only posts are delivered to the instance where your followers reside, and private mentions are delivered to the instances of the recipients, in so far as those followers or recipients reside on a different instance than this.

When you authorize an application to use your account, depending on the scope of permissions you approve, it may access your public profile information, your following list, your followers, your lists, all your posts, and your favorites.

Applications can never access your e-mail address or password.

## Moving Away

You may close your Mastodon account or move it to another instance at any time.
You may also [redirect users from your profile](https://docs.joinmastodon.org/user/moving/#migration) here to your identity on your new instance.
You are in control of your identity and your social graph on Mastodon (and other federated instances), but the administrators here control your ability to use this instance and to interact with its users.

## Usage by Children

### EU or the EEA users

Our site, products and services are all directed to people who are at least 16 years old.
If you are under the age of 16, per the requirements of the GDPR ([General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation)) do not use this site.

### USA users

Our site, products and services are all directed to people who are at least 13 years old.
If you are under the age of 13, per the requirements of COPPA ([Children's Online Privacy Protection Act](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act)) do not use this site.

## Legal Jurisdictions

Our databases and media stores are located in Canada and the United States. Specific legal requirements may be different if this is in another jurisdiction than your own.

## Changes to our Privacy Policy

If we decide to change our privacy policy, we will post those changes on this page.
