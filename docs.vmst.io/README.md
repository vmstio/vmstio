## [docs.vmst.io](https://docs.vmst.io)

### Contributing

We use Netlify to generate our static website and deliver it to users bia their worldwide CDN.

Content on the `main` branch is what automatically generates the [docs.vmst.io](https://docs.vmst.io) site.

#### Staff Contributions

The `main` branch will only accept changes via Pull Request.

* vmst.io staff members with Contributor rights to this repo, should create a new branch based on the `main` branch to commit their work for a specific task.
* Once work on that task has completed, the branch should be merged with `main` via a PR.
* Netlify will automatically generate a preview version of the changes under the `rand-vmstio-docs-prod.netlify.app` domain.
* The preview link is accessible in the PR on GitHub and also will be posted to the internal Slack.
* After the PR is merged, your working branch should be deleted.

In order to limit the ability to move to production, PR's to the `main` branch must be reviewed by one other staff member with contribution rights.

#### Outside Contributions

We welcome outside contributions to our documentation site.

* You should Fork this repo based on the `main` branch to your own repository, and commit work for a specific change there.
* Once work on that task has completed, the changes should be submitted to vmstan/vmstio `main` via a PR.
* Netlify will automatically generate a preview version of the changes under the `rand-vmstio-docs-docs.netlify.app` domain.
* The preview link is accessible in the PR on GitHub.

vmst.io staff members will review the request and either accept or deny the submission, or ask for additional changes.

