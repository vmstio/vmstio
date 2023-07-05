---
title: Monitoring
---

# Monitoring

We monitor the health and availability of our infrastructure in a few different ways.

## BetterUptime

This powers our [status.vmst.io](https://status.vmst.io) page.
It monitors the status of our external endpoints:

- Mastodon (vmst.io)
- Streaming API (streaming.vmst.io)
- Media Storage (cdn.vmst.io)
- Elastic Search (elastic.vmst.io)
- Elk (elk.vmst.io)
- Semaphore (semaphore.vmst.io)
- Matrix (matrix.vmst.io)
- Element (element.vmst.io)
- Documentation (docs.vmst.io)

Uptime is calculated for the last 30/90 days.

In addition to providing a page for members to check when there might be issues, it actively alerts our team to any issues.

## Digital Ocean

We use integrated metrics monitoring available through Digital Ocean to monitor and alert on CPU, memory, disk and other performance metrics of the host virtual machine and managed database systems.

![Digital Ocean Alerts](https://cdn.vmst.io/docs/do-alert.png)

## Community Monitoring

- [FediDB Entry](https://fedidb.org/network/instance?domain=vmst.io)
- [Instances.social](https://instances.social/vmst.io)
