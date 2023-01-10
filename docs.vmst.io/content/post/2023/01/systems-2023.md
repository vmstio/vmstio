---
author: Michael Stanclift
title: Systems 2023
date: '2023-01-04'
description: The only constant is change
tags:
  - infrastructure
---

![Infrastructure as of Jan 2023](https://cdn.vmst.io/docs/vmstio-simple-jan23-round.png "Infrastructure as of Jan 2023")

One of my core beliefs about Mastodon and the Fediverse is that there needs to be transparency in the operations of the various projects and instances.

This includes transparency in both the financial and technical operations of the instance. For the financial piece, we have a single source of truth on our [Funding](/funding) page that has total income from memberships as well as monthly/yearly expectations of expenses. We'll be providing a more granular update here soon that shows exactly where we are in terms of free cash flow. (Preview: we're solid for a bit based just on membership rates + one time donors to date.)

## Another Server Post?

I don't intend to post about our infrastructure changes on a monthly basis, it just seems like I've done nothing by rearrange things on an almost daily basis, so I feel it important to discuss them.
Every time I've posted something like this, I've had some kind of feedback from other #mastoadmins or even members with suggestions of ways to do this better. I'm not saying that things are settled, but I feel like we're in a good place right now.

Last time I provided an update was [December 15, 2022](/post/2022/12/infrastructure-updates/).
Just before Elon Musk did something else really stupid, I don't even remember what it was at this point.
In the course of a few hours the headcount of the instance doubled.

Sometimes the only ways to test a system are by putting it under stress.
Since that last update it became obvious that the way I had Sidekiq laid out wasn't optimal.
Last month I had the front end nodes (Kirk and Spock) doing both Web services, and Sidekiq ingress queues.
(Ingress is responsible for handling the influx of data from other instances, so anytime someone else posts an update and they let us know, we have to go fetch that data and any attachments.)
One day I woke up and the site was down because someone somewhere posted a video and the front end nodes were being crushed by ffmpeg processes.
Not ideal.

### Changes Since December

- "Scotty" is now responsible for handling the bulk of Sidekiq activity, including the Ingress queues. The front end nodes now only handle the primary Mastodon Web functions.
- "Uhura" is now responsible for handling the Mastodon Streaming API, as well as acting as a HTTPS proxy for other backend services like our internal metrics and monitoring. One deviation from Kirk and Spock that handle web traffic, is that Uhura is running Caddy as a web proxy instead of nginx. This is somewhat experimental but has not presented any known issues. Uhura now also hosts our [status.vmst.io](https://status.vmst.io) system powered by a self-hosted instance of Uptime Kuma. This replaces the services of Uptime Robot.
- "Exec" no longer hosts Elastic Search, which has been moved to the free tier of AWS and replaced with Open Search. Exec runs smaller versions of Scotty's Sidekiq queues plus the scheduler queue, but is primarily responsible for the management, backups and automation of the entire Mastodon system.
- "Kirk" and "Spock" are now running fully updated versions of nginx, with restrictions on TLS versions (1.2 or higher now required) and ciphers. As a result support for older browsers (IE8) or systems (Java 7) have been dropped. This is unlikely to actually effect anyone negatively.

I have also moved this site back to the Digital Ocean static site generator.
I was running there previously, then moved to Netlify as a test.
While there was nothing wrong with Netlify it just didn't make sense having things in another control panel with no added benefit.

The backup processes have been streamlined.

- I have dropped the trial of SimpleBackups that I was running as it was too expensive for what it provided.
- For the backup of Postgres we use `pg_dump` and `redis-cli` for Redis.
- The native `b2-cli` utility is then used to make a copy to a Backblaze B2 bucket.
- The CDN/media data is sync'd directly to Backblaze B2 via `rclone`.
- This is done using some custom script that process each task and then fire off notifications to our backend Slack.
- Backups run every 6 hours. Database backups are retained for 14 days, currently. This may be adjusted for size/cost considerations down the road.
- All backups are encrypted both in transit and at rest.

Previously a lot of the automation functions for things like firing off notifications to the Mod Squad in Slack about reported posts, new users, or various server activities were done using Zapier.

Recently I started working with n8n as a self-hosted alternative and have moved almost all of our processes there and expanded out to many more.
Zapier is still used to notify and record donations via Patreon and Ko-fi because they have some native integrations that have proven troublesome to recreate in n8n, but the intent is to move away as soon as possible.

### Provider Overview

| **Vendor** | **Service** |
|---|---|
| Digital Ocean | Managed PostgreSQL, Managed Redis, Managed Load Balancer, Static Site Generator (Hugo), Managed CDN/Object Store, Virtual Machines (Droplets) |
| Sendgrid | SMTP Relay |
| DNSimple | Registrar, Nameservers & SSL Certificate (via Sectigo) |
| Backblaze | Database & Media Backups on B2 |
| AWS | Elastic/Open Search (free tier) |
| GitHub | Configuration Repository |
| Slack | Team Communications |

There was a brief flirtation with using Mattermost as an alternative to Slack, but given that almost the entire staff uses Slack for other purposes already it made sense to avoid creating one more communications tool for everyone to manage.
There are also a number of existing native integrations between Digital Ocean and Slack.

### Mastodon Software Stack

One thing that I wanted to touch on before I close this out, is the idea of Mastodon forks (such as Glitch or Treehouse) or doing other local modifications to the Mastodon stack.

Our goal is to run the **latest** stable version of the Mastodon experience as soon as it's available, with a goal of being live here within 72 hours of being published.
If there are security related updates we intend to take those on even quicker to protect our infrastructure, users and your data.
In order to do this we run **unmodified** versions of the Mastodon code found on [GitHub](https://github.com/mastodon/mastodon), specifically consumed via Docker using the images provided by Mastodon to [Docker Hub](https://hub.docker.com/r/tootsuite/mastodon).

In order to mitigate an issue with the Streaming API and backend PostgresSQL database, we've had to do one modification to the `streaming/index.js` that disables an self-signed SSL check by editing two lines in the code.
Because of this, that component is not running via Docker but instead running as a native Linux systemd service.
Once this workaround is not necessary in the upstream Mastodon code, we will revert to the mainline Docker image.

Other than those changes necessary for the functionality of our system, we do not intend to modify or customize Mastodon code in any other way that changes the user experience.

## Previous Reviews

- [December 15, 2022](/post/2022/12/infrastructure-updates/)
- [November 28, 2022](/post/2022/11/new-infrastructure/)
