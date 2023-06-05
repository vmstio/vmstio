---
title: Matrix
description: Federated, encrypted messaging
---

# Matrix

[Matrix](https://matrix.org) is an open network for secure, decentralized communication.
Matrix lets you do realtime messaging in 1:1 sessions or in groups, with end to end encryption.

You can use a variety of different clients to login to Matrix. If you're familiar with Matrix you can grab your [client of choice](https://www.matrix.org/clients/). Element is a great client option for multiple desktop platforms, Android and iOS.

To make things even easier, we run our own Element client at [element.vmst.io](https://element.vmst.io).

:button-link[Launch Element]{icon="simple-icons:matrix" href="https://element.vmst.io" blank}

## Logging In

The first time you login you'll need to establish your Matrix account, your vmst.io username may automatically populate, but needs to stay the same as your Mastodon username for consistency. Your "homeserver" will be **matrix.vmst.io** and when you login you'll use your Mastodon credentials, so there's no second set of passwords to manage.

![matrix.vmst.io](https://cdn.vmst.io/docs/matrix-login.png)

You can now talk to anyone else on the Matrix platform, not just other vmst.io users who have activated their accounts!

::alert{type="info"}
Your Matrix handle will be as **@username:vmst.io** for sharing with other users to help in finding you on the network.
::

After you've logged in, you can also join `#general:vmst.io` and chat with other vmst.io users.

## Synapse

Our Matrix deployment is based on [Synapse](https://matrix.org/docs/projects/server/synapse) server, running in a Docker container from the project's official [Docker Hub image](https://hub.docker.com/r/matrixdotorg/synapse).

Our implementation is configured to authenticate against [vmst.io](https://vmst.io), so your Mastodon username and password is a single sign-on to this service.

Example of the Synapse `homeserver.yaml` relevant to authentication:

```text
oidc_providers:
- idp_id: my_mastodon
  idp_name: "Mastodon"
  discover: false
  issuer: "https://vmst.io/@whodoyouthink"
  client_id: "theitsybitsyspiderwentupthewaterspout"  
  client_secret: "downcametherainandwashedthespiderout"
  authorization_endpoint: "https://vmst.io/oauth/authorize"
  token_endpoint: "https://vmst.io/oauth/token"
  userinfo_endpoint: "https://vmst.io/api/v1/accounts/verify_credentials"
  scopes: ["read"]
  user_mapping_provider:
    config:
      subject_claim: "id"

password_config:
    enabled: false
```

_Out came the sun and dried up all the..._ sorry.

## Element Web

We run our own instance of Element Web from a Docker container.
When visiting [matrix.vmst.io](https://element.vmst.io) or [element.vmst.io](https://element.vmst.io) users are automatically directed there, configured to use our Matrix homeserver.

Once their account is established, users are encouraged to use a dedicated Matrix client from their desktop or mobile device.

Element Web runs on our main Kubernetes cluster.
