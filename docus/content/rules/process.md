---
title: Moderation Process
description: Our internal guidance
---

# Moderation Process

_This is our internal guidance for Moderators, but in the spirit of full disclosure we have decided to make it open to public viewing._

## Staff

A full list of active staffers can be found at [https://docs.vmst.io/staff/](/staff)

There are two levels of moderation staff with different abilities:

* Administrator
* Moderator

All staff should be intimately familiar with the [Rules](/rules)

### Moderators

Moderators are able to take action on any reported or observed user account in violation of our rules.

### Administrators

Administrators have the ability to de-federate entire instances for continued violation or bad actions against our members, or our infrastructure. They also act as senior moderators and community leaders.

The Administrators are **the final authority** on any appeals, moderation issues or rule interpretations.

## Reports

When a post is reported, all members of the staff will receive an email alert. There is also an alert message posted to the "vmst.io Moderation" room in Matrix. Both alerts include links to the report in the Mastodon UI.

Reports about members of the staff cannot be seen by that staff member in the Mastodon UI.

For whatever action you take on a report, please post to the thread in Matrix as an indicator that you’ve followed up. If you need to loop in another staffer for an assist do so via @mention within Matrix.

All internal discussion of reports should be considered confidential.

## Report Types

There are three main types of reports on Mastodon

* vmst.io user vs vmst.io user (intra-instance)
* vmst.io user vs federated instance user (inter-instance)
* federated instance user vs vmst.io user (inter-instance)

### Intra-Instance Reports

When our users report our users, we are only accountable to ourselves. In this case it’s likely that someone will be unhappy with the results of the reporting and subsequent action. We must do what is right and in the best interest of the community.

While members can appeal, they also have the ability to migrate their account to another instance if the resulting moderation actions do not satisfy them.

### Inter-Instance Reports

When reports involve other instances, we must always be mindful that there is a moderation team involved in both places. Our team is responsible for the enforcement of our rules on our instance, and other instances may have rules and interests that are different from our own.

#### vmst.io vs The Federation

When our members report another instance user, we have the ability to prohibit the remote user from interacting with our members, but we cannot control what the moderation team of the other instance does with their report. If we take action to limit their account and it’s abilities, those only impact it’s interaction with OUR users.

If there are entire instances that are engaging in behaviors that are putting our users at risk, then we can take action to defederate the entire instance. Directors and Administrators have that power.

#### The Federation vs vmst.io

When users of another instance report our users, we must be mindful of two things:

* Are they violating OUR instance rules
* Are they making us look like a bunch of jerks.

If we have members who are continually getting reported by other instances, those administrators and moderators may eventually take action to defederate our instance.

If what our members are doing are not in violation of our rules, but are deemed inappropriate for the community of another instance, then that’s their prerogative to take action to limit that user from interacting with their users, just as we can do the same.

If you see reports that may rise to this level, please raise the issue in Slack so we can discuss.

## Available Actions

There are a few options available for any reported content.

* Mark as resolved
* Delete posts
* Limit user
* Suspend user
* Send a warning
* Freeze user
* Set content Sensitive

The most common types of moderation events are expected to be Mark as Resolved or Send a Warning to the member. Limiting or suspending users should be done only when there are clear and serious violations of site policy.

All default user moderation decisions will notify the affected user by email. Some of the options accessible under Custom have the ability to disable the user notification settings, but sending email notices is still considered standard practice.

See also: [https://docs.joinmastodon.org/admin/moderation/#individual-moderation](https://docs.joinmastodon.org/admin/moderation/#individual-moderation)

### Mark as Resolved

Marking as resolved generally means you’re dismissing the report, because it’s determined to be not worthy of moderator action. No mark is left against the user's profile.

### Send a Warning

Sending a warning can be found under Custom, and is preferable when a user maybe steps out of line but doesn’t require any specific corrective action.

If a user has had multiple warnings issued, especially for the same type of behaviors, then additional corrective actions may be required.

### Set Content Sensitive

Set content Sensitive could be useful for posts that should probably have a content warning but were not initially set (NSFW type materials, or other things that may be offensive to other members.)

### Freeze User

Freezing a user can be found under Custom, and prevents a user from posting with their account but does not hide or delete any previous posts. Useful for folks who need a time out, although there’s currently not a time based mechanism for enforcement.

### Limit User

Limit user prevents the user from being able to post with public visibility, meaning anything they do in the future is hidden from anyone who’s not already following. This is effectively a “shadow ban”

### Suspend User

Suspending a user is equivalent to a ban, as this prevents any interaction with the account and sets their account to be deleted by the server in 30 days unless other actions are taken.

## Call for Backup

If you’re unsure of what to do, ask for a second set of eyes. If no one else is available then you’re empowered to take action against the account to freeze it if you feel that it will stop a further escalation of the issue, until we can further assess the issue and make a determination as to what action is appropriate long term.

## Appeals

Users can appeal actions of moderators. In such cases actions of moderators will be reviewed by an administrator, and after additional discussion or deliberation the appeal by be accepted or denied.

## Brand Accounts

Moderators should also see our policy on [Brand Accounts](/rules/brands/).

While we try to vet these through the application process, they make it through from time to time. These types of violations should be handled by Administrators. In most cases they’ll be asked to migrate their account to a different instance.

## Extremism

We have a zero tolerance policy for violations of the bigotry or extremism policies. If you find users posting openly hateful content you are authorized to delete the offensive posts and suspend the user’s account.

If the account has just signed up or their time on the instance has only been used for such content, reach out to an Administrator for immediate deletion of the account profile.

## Sexual Content

Users are not prohibited from following accounts from other instances that post explicit content, even if we do not permit posting it locally.
As a result explicit content may show up on the Federated timeline where it’s viewable by all members.

Moderators may issue limitations to remote accounts who regularly post explicit content.
Limiting the account will enable those who directly follow the account to continue accessing it, while preventing its visibility on the Federated timeline.

If local accounts are deemed to be following such content in an attempt to “poison” the federated timeline, those accounts should be suspended after consultation with an Administrator.
