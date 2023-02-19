## [docs.vmst.io](https://docs.vmst.io)

### Contributing

The `main` branch is what automatically generates the [docs.vmst.io](https://docs.vmst.io) site.

The `staging` branch where changes via PR should be contributed to, and will automatically generate the [staging-docs.vmst.io](https://staging-docs.vmst.io) site.

#### Staff Contributions

The `staging` branch will only accept changes via Pull Request.

* vmst.io staff members with Contributor rights to this repo, should create a new branch based on the `staging` branch to commit their work for a specific task.
* Once work is done with that task has completed, the branch should be merged with `staging` via a PR, which staff members can do themselves.
* Netlify will automatically generate a preview version of the changes under the `rand-vmstio-docs-staging.netlify.app` domain.
* The preview link is accessible in the PR on GitHub and also will be posted to the internal Slack.
* After the PR is merged to `staging` the changes are viewable on [staging-docs.vmst.io](https://staging-docs.vmst.io).
* After the PR is merged, your working branch should be deleted.

In order to limit the ability to move to production, PR's to the `main` branch must be reviewed by one other staff member with contribution rights.

PR's made directly to `main` from any branch other than `staging` should be rejected.

#### Outside Contributions

We welcome outside contributions to our documentation site.

* You should Fork this repo based on the `staging` branch to your own repository, and commit work for a specific change there.
* Once work is done with that task has completed, the changes should be submitted to vmstan/vmstio `staging` via a PR.
* Netlify will automatically generate a preview version of the changes under the `rand-vmstio-docs-staging.netlify.app` domain.
* The preview link is accessible in the PR on GitHub and also will be posted to the internal Slack.
* vmst.io staff members will review the request and either accept or deny the submission, or ask for additional changes.

PR's must be submitted to the `staging` branch.