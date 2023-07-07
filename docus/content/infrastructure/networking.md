---
title: Networking
---

# Networking

The local IP space used between systems on our virtual private cloud (VPC) network is issued by Digital Ocean, with static IP addresses that are assigned at creation of the Droplet and persist throughout the lifecycle of the virtual machines.

Where possible, any communication between internal nodes is encrypted even though the communication takes place on the VPC network.

There are a few cases where traffic leaves our VPC but still communicates within the Digital Ocean network, such as when data is moved between Droplets in Toronto and the Object Storage in NYC, or during replication between NYC and SFO data centers.

## Public IPs

The public IP addresses assigned to our load balancer, CDN and virtual machines are IP addresses issued and owned by Digital Ocean.

### IPv6

At this time none of our systems are accessible via IPv6.
This is due to a [known limitation](https://docs.digitalocean.com/products/networking/load-balancers/details/limits/) of Digital Ocean's managed load balancer service.

As the load balancer is our entry point for all other services, we do not enable IPv6 for Droplets even though it is technically supported.

### DNS Resolution

We use [DNSimple](https://dnsimple.com/) for our domain registrar and use Digital Ocean for our nameservers.

## Security

In order to protect our user's privacy and data, we implement a number of different security measures on our systems.

They include:

- Preventing unnecessary external access to systems through OS and service provider firewalls, and limiting communication between internal systems only to the source/destination ports and protocols required for functionality.
- Blocking any access to the system from known problematic networks.
- Leveraging an intrusion detection system to detect and deny access to active bad actors.
- Using updated versions—from trusted sources—of the source code and binaries downloaded to our systems.
- Requiring encrypted connections to all public facing elements, deprecating insecure ciphers, and using secure connections where possible—even on private networks—for communication between internal systems.

### Certificates

We use [Let's Encrypt](https://letsencrypt.org/) as our primary certificate authority.
