---
author: Michael Stanclift
title: Anecdotal Registration Data
date: '2022-12-08'
description: Observations on instance sign-ups
tags:
  - mastodon
  - registrations
---

I’ve had a few thoughts rattling around about registration numbers here, vs instances that are generally wide open.

- The instance officially went live on October 6, but didn’t let anyone else join until a few weeks after.
- We are listed on [joinmastodon.org](https://joinmastodon.org) so we definitely see more random user signups than instances that just rely on word-of-toot.

Because we ask folks to "apply" for their account here rather than just signup without moderation, we get maybe 1/10th the number of registrations you’d see in somewhere else.
The bulk of folks coming from Twitter en-mass were scared, impatient, unwilling to wait.
I base this on my observations of registration activity during the mass migration of folks coming over after the Twitter layoffs.
Some sites that had open registration with less than a 100 users at the start of November ended that week with over 30,000 accounts. We had probably 3,000 applications during that two day period, before the decision was made to close registrations temporarily.

All of this is to say, we have just over 1600 members right now. We could have had a lot more if we wanted.

Of those who apply, we have a method of deciding who to let in:

- We look at the username and display name and reject anything that’s obviously distasteful given the type of community we are seeking to build (xxxlol69, etc)

But specifically we ask folks to give a reason why they want to join:

- If people put nothing there, it’s rejected.
- If they put “idk” it’s rejected.
- If they just tell me that “Elon sucks” it’s rejected.
- If it just looks kinda sus... it’s rejected.

We also decided that if the application isn’t in English it will also be rejected.
We are clear in our site description that we are English speaking.
This isn't done out of some desire to limit interaction of folks in other languages.
We do this only because of our current inability to moderate non-English posts.

We try never to approve a user until they’ve confirmed their email account.
We’ll manually trigger at least one reminder email for confirmation but if after a few days the account remains unconfirmed, we remove it from the queue.

That basic level of filtering probably means about 1/5 of the people who apply are accepted.
That isn't some target/goal, that's just the rough estimate based on the facts above.

As I was writing this, there were 9 people in the queue.
I approved 2.
There has been a somewhat noticeable uptick in the amount of junk registrations.
On Tuesday I rejected probably 20 in a row where they were obviously just spamming our registrations page.

We’ve periodically closed registrations when we needed to, and had an extended period as we migrated from Masto.host to running on our own infrastructure.
With that exception, we’re not keeping things small because of major infrastructure considerations at this point.
We want things to be performant for the folks who are here, but we can scale a lot higher if we choose to.

We do this mostly because we want to scale the community here in a responsible way.
