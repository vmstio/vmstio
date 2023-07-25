---
title: Trends
description: Are you a human or a robot?
---

# Trends

One of the key features of Mastodon is there's no sophisticated algorithm to drive more traffic to the site, or influence your thinking.
All posts are displayed in a traditional chronological timeline with the newest posts or boosts made by people or hashtags you follow displayed at the top of the page.

Mastodon does offer trending hashtags, posts, and links features on the [Explore page](https://vmst.io/explore) that are based solely on observed activity within vmst·io and other federated instances.

## Where's the Algorithm?

Trends are calculated based on a simple combination of boosts (reposts) and favorites, with a decaying score to make sure that older content cannot trend forever based on additional interactions.

For example, the exact code for trending posts is found on GitHub in the [app/models/trends/statuses.rb](https://github.com/mastodon/mastodon/blob/main/app/models/trends/statuses.rb) file.

```ruby
observed  = (status.reblogs_count + status.favourites_count).to_f

score = if expected > observed || observed < options[:threshold]
        0
        else
        ((observed - expected)**2) / expected
        end

decaying_score = if score.zero? || !eligible?(status)
                    0
                else
                    score * (0.5**((at_time.to_f - status.created_at.to_f) / options[:score_halflife].to_f))
                end
```

The process is similar for other types of trending content.

## Who (or what) decides the trends?

Hashtags largely trend on their own without moderator intervention, but can be removed if they are abusive or disruptive.

Links and user posts will largely trend automatically if they're from reputable or mainstream news sources, or by users that are not disruptive with a history of appropriate content.

Some posts will trend automatically if they're from known figures with a history of appropriate content.
Generally speaking, trends are only removed if they are deemed inappropriate for the context of our instance.

Some publishers are specifically prohibited from trending.
A list of prohibited publishers is available upon request.
