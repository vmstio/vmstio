---
author: Michael Stanclift
title: Infrastructure Updates
date: '2022-12-15'
description: Interate, interate, interate
tags:
  - digital ocean
  - cloud
  - mastodon
  - sendgrid
  - redis
---

![Infrastructure as of December 15](https://cdn.vmst.io/docs/vmstio-simple-2022-12-15.png "Infrastructure as of December 15")

I wanted to provide a round-up of some changes to our infrastructure since it went live last month.

### No More Cloudflare

Our domain had always been registered and DNS provided through Cloudflare.
For a brief period I was testing their WAF (web application firewall) service with the site but this led to more problems than perceived benefits.
The sentiment within the Fediverse is generally negative towards Cloudflare, although many other instances use them.

When attacks were launched against various ActivityPub instances by a bad actor being protected by Cloudflare, I decided that it was time to stop using their services.
The domain is now registered through a different service but is in the process of being transferred to Gandi. DNS services are provided through DNSimple.
I intentionally broke up these two components.
DNSSEC is currently not enabled for the domain, but will be as soon as the transfer work is completed.

I may look for an alternative to provide a level of DDoS/WAF protection for the site, as we grow. For the time being your secure connections will terminate directly to the Digital Ocean managed load balancers and CDN.

### Streamlining Certificates

We launched with free Let's Encrypt digital certificates for the site and CDN.
Let's Encrypt is designed to be a fully automated certificate authority.
I love Let's Encrypt and everything they stand for.
Unfortunately due to the way our web servers, CDN, and load balancers are configured, automation was easier said than done.

While I could have continued to manually generate the certificate and apply it to the various components every 90 days, I decided for the sake of not being responsible for that to purchase a certificate through Sectigo for this use.
Not only does this extend the renewal responsibility to a year, the generation and application is simpler for me on the backend.

Additionally, [docs.vmst.io](https://docs.vmst.io) has been moved from the Digital Ocean static site generator to Netlify.
The major reason was to allow the use of customer provided certificates. Digital Ocean only uses certificates issued by ... Cloudflare.

Our [status.vmst.io](https://docs.vmst.io) page will continue to serve a Let's Encrypt certificate, as there is no mechanism to provide a customer certificate on that service through UptimeRobot.

### Backups

No one wants to think about backups.

Backing up the instance on Masto.host was provided by the service.
Prior to recently, as the focus was just getting things established, I was doing backups only of the database on a manual and infrequent basis.
I liked nothing about this.

I'm currently trialing a service called SimpleBackups that integrates with Digital Ocean to connect to the Redis and Postgres databases, and CDN/Object Store, as well as use native connections GitHub, to automate and perform regular backups of the infrastructure on a daily basis.
Once I have a handle on size, load, and timing, we'll take more frequent backups.
Backups are done to locations outside of Digital Ocean, so in the event of a disaster that impacts the Toronto or NYC datacenters where our data lives, or if Digital Ocean decided to go evil and delete our account, we'll be able to recover the data from a combination of AWS and Backblaze.

The configurations for all of the Docker and Mastodon components necessary to reconstitute the site (even on a totally different provider) are all stored in a private GitHub repository, also backed up (in multiple locations) to allow quick recovery of any critical component.

### Reduced Frontend Count

We originally launched with three frontend servers.
After spending the last month tweaking Sidekiq, Puma, database pools, and other various Mastodon related services, I decided to vertically scale the front end systems but reduce the count to two.
This is actually cheaper than running the three smaller ones.

Should we experience a need to scale back up to three, it will be trivial to do so as the front end servers are actually an image on Digital Ocean that can be deployed within a few minutes.
I originally wanted three to allow flexibility during maintenance operations, if a server was down for updates and we experienced a load spike or other event.
Because of the ease of image deployment and the centralized configuration I have put in place, I can temporarily deploy an additional front end system while another is out of service with just a few clicks.

Additionally, after making adjustments post-Cloudflare, the load balancer should serve up connections via the HTTP2 protocol. While mostly transparent to users, this has the effect of drastically reducing load on the web-frontend.
