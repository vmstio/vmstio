---
author: Michael Stanclift
title: New Infrastructure
date: '2022-11-28'
description: Looking behind the firewall
tags:
  - digital ocean
  - cloud
  - mastodon
  - cloudflare
  - sendgrid
  - redis
---

![Infrastructure as of November 28](https://cdn.vmst.io/docs/vmstio-infrastructure-2022-11-28.png "Infrastructure as of November 28")

_This post is a rollup and expansion of a [set of Toots](https://vmst.io/@vmstan/109400309033218817) around the new vmst·io infrastructure that went live on the morning of Wednesday, November 23, 2022._

When I launched vmst·io at the start of October, it was intended to just be a personal instance. [mastodon.technology](https://mastodon.technology) had just announced it's pending closure, and I wanted to see what it was like to own my own corner of the Fediverse.

I signed up for a $6 plan with [masto.host](https://masto.host) and migrated my account. Everything was great, except it was kinda boring. Being on a single-user instance means your local timeline is just you, and your federated timeline is just the same people you follow.

So I invited a few friends to join me, and upped the hosting to the $9 plan. Then Elon officially bought Twitter and suddenly a few more friends wanted to join me, so I went to $39. Then Elon purged Twitter staff and suddenly I needed about $79 worth of hosting.

Even before I went to the $39 plan, I started wondering if I could run this myself. So I started digging into documentation, testing various providers, and building an architecture. That is what we moved into on November 23. Now that things have settled, want to take a peek behind the firewall?

### Horizontal or Vertical

When we talk about scaling any platform, there are generally two directions you can go. Horizontal or vertical.

Vertical scaling is generally easy, if your app needs more memory than the host has, add more. If it needs more CPU, and it's multi-threaded, just add more. Horizontal scaling is sometimes a little more tricky. This means adding more instances of your application. Even though we're a small instance in comparison to places like [hachyderm.io](https://hachyderm.io) or [infosec.exchange](https://infosec.exchange), my goal was to build us from the start to be able to go both directions.

Almost all of our new infrastructure lives in the Toronto and New York data centers of Digital Ocean. Email notifications are handled by Sendgrid. DNS resolution comes through Cloudflare.

All public traffic is encrypted and what isn’t happens on private networks. We are using managed load balancing and database services. The various self-managed services run on Debian based Docker hosts.

### Why Digital Ocean?

While the company I work for is a major partner of the major public cloud players, I like to support the littler/independent folks.

I’ve hosted many things in Linode and Digital Ocean over the years, and in comparing the two it’s really a toss up in price and features. The managed database offering is what finally pushed me to Digital Ocean. The uncertainty with Linode being acquired by Akamai recently, also weighed in.

One thing I wanted to do was put the backend databases (PostgreSQL and Redis) into managed instances, because I'm not a DBA or an expert in either platform. Linode offered only managed PostgreSQL, and to get no-downtime upgrades you had to purchase their high availability option which was a minimum 3x increase in price for a similarly spec'd platform.

Digital Ocean also had support for pgBouncer built in. More on that later.

### Why Toronto?

I’m in the central US, so response times to any DC offering in North America are usually pretty good. I had our moderators and some friends in other countries (Europe) test and they came back with Toronto as the lowest on average. Also, I figured putting the servers in Canada would make sure they were polite. 🇨🇦

The object store is in New York because it was the closest geographical DC where DO offered the service. The speed of light is only so fast.

### Why Sendgrid?

I tried Mailjet first and found it finicky. I tried Sendgrid and it worked the first time and every time since. What I discovered later was that by default Sendgrid includes tracking links/images in messages. I have zero interest in knowing if you’re opening your notifications and I personally run blockers to disable all this junk in my own email.

So while it’s relatively benign, and is related with the service offering, it’s not consistent with our privacy policies so they have been disabled going forward.

### Why Cloudflare?

Cloudflare is our domain registrar, and also DNS provider.

### What does vmstio-exec do?

vmstio-exec is essentially the Master-Mastodon node, holding the configuration that is presented to the worker nodes. Also, unlike on the workers, Mastodon is not in a container so I can do things like have direct database access and access to utilities like `tootclt` without impacting front end traffic.

Mastodon requires one Sidekiq node to run the "scheduler" queue, so that's where it sits. It also has more CPU and memory allocated so it can process other Sidekiq jobs while the worker nodes focus on web traffic.

The NFS share is used to make sure that all of the worker nodes always have the same/latest copy of the configuration and certificates.

### What do the vmstio-workers do?

These are the frontend nodes for the site. User requests (either direct or from federated instances) flow through Cloudflare to our Digital Ocean managed load balancer. This load balancer can currently handle up 10,000 concurrent connections, and easily scale beyond that with a few clicks.

The load balancer monitors the health of every worker node and if they're reporting that they're available, then  nginx will handle accept user connections.

The workers run a complete deployment of Mastodon in Docker containers. Docker allows each startup of the application components to be a clean boot from the image provided by Mastodon. (I hope to move the nginx component to a Docker container before long.)

Each worker has threads dedicated to handling the frontend web traffic (Mastodon Web & Mastodon Streaming), as well as processing some of the backend load (Sidekiq).

There are usually three worker nodes running. This allows at least one to be down for maintenance, without impacting user traffic. They are regularly reimaged via Digital Ocean tools, although not automatically.

### What is Stunnel for?

Mastodon (specifically the Sidekiq component) cannot currently speak native TLS to Redis, meaning all of the traffic is over plaintext. While this isn't a deal breaker as the communication is happening over a private network, it's not ideal. Additionally, I wanted to use Digital Ocean's managed Redis offering instead of being responsible for this component myself. Digital Ocean does not permit you to disable TLS.

Stunnel creates a secure tunnel for the connection from Mastodon/Sidekiq to Redis, sidestepping Mastodon's lack of TLS unawareness. Mastodon actually thinks it's talking to a Redis instance running on localhost.

### What does the Object Store do?

This is where all of the image, videos and other media that gets uploaded is stored. It also caches the media of federated instances that you interact with. There is a CDN (Content Delivery Network) that is managed by Digital Ocean that brings these large files closer to your location when you access them. That ability is further enhanced by Cloudflare.

### What does Elastic Search provide?

When you search for content within the instance, Elastic Search is used to scan the content of your posts, and other posts you interact with so that you don't have to go hunting for it later. Without Elastic Search running you'd only be able to search by hashtags. Not all Mastodon instances have this available.

### What is a pgBouncer?

pgBouncer manages the connection by the various worker/exec nodes, their various Sidekiq and Puma (web) threads, to the PostgreSQL database. This provides more flexibility in scaling up and managing connection counts. It effectively acts like a reverse load balancer for the PostgreSQL database.

### Are you done?

Never. As we find betters ways to secure, scale, or provide resiliency -- we'll iterate. Even since launching last week, we've changed a few things around like using Stunnel for connection to managed Redis databases, and added Telegraf and InfluxDB for better telemetry of the infrastructure.

Enjoy!
