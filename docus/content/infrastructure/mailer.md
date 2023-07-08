---
title: E-mail
---

# E-mail

All e-mail notifications associated with the vmst·io Mastodon instance should come from: `mastodon@ses.vmst.io`.

We use [Amazon Simple Email Service](https://aws.amazon.com/ses/) as our managed SMTP service, used for sending new user sign-up verifications, and other account notifications.

Example of `.env.production` configuration settings relevant to SMTP:

```text
# Mail
SMTP_SERVER=email-smtp.amazonaws.com
SMTP_PORT=465
SMTP_LOGIN=YoUrSESIssuEdUsErNAME
SMTP_PASSWORD=123456789+098765432
SMTP_FROM_ADDRESS='Mastodon <mastodon@ses.vmst.io>'
SMTP_SSL=true
SMTP_DELIVERY_METHOD=smtp
```

* We leverage industry technologies like `SPF` to help verify we are the only ones sending you emails.
* We also use **[EasyDMARC](https://easydmarc.com)** to handle things like `DMARC` and `BIMI` for the domain.
* We use **[Fastmail](https://fastmail.com)** for the root `@vmst.io` domain.

## Phishing and Privacy

Our domain policies instruct your email provider to reject any other party that is attempting to use the `@vmst.io` domain to phish you.

When you sign up for an account, and you provide us an email address, we promise to only contact you there regarding your Mastodon account.
For more details, refer to our [Privacy Policy](https://vmst.io/privacy-policy)
