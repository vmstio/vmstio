---
title: Providers
---

# Providers

This list represents the cloud provider dependencies to which vmst.io has a direct relationship.
If any of these providers have issues, it may create issues for vmst.io services.
Some of these services are paid for while others are free to use.

| Vendor | Service |
|---|---|
| Digital Ocean | Managed Postgres, Managed Redis, Managed Kubernetes, Object Storage, Static Site Generator, Content Delivery Network (CDN), Load Balancer, Private Container Registry and Nameservers |
| AWS | Simple Email Service |
| BetterUptime | Status Monitoring |
| DNSimple | Domain Registrar |
| Let's Encrypt | SSL Certificates |
| GitHub | Configuration/Settings, Public Container Registry |
| Docker Hub | Public Container Registry |
| hCaptcha | Bot Detection |
| Apivoid | IP Information |

Other vendors or open-source projects that we consume or utilize but do not have an ongoing external API or system connection to are not included in this list.
For example, rclone is used to backup our platform, but it is integrated into a custom container image that is built and deployed.
The availability of the application on it's download site is not mandatory for the operational readiness of vmst.io.
