# Security

## Vulnerability Reporting

If you find a significant vulnerability, or evidence of one, please report it
privately.

We prefer that you use the [GitHub mechanism for privately reporting a
vulnerability](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability#privately-reporting-a-security-vulnerability).
Under the [main repository's security
tab](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/security), click "Report a
vulnerability" to open the advisory form.

If you have any further concerns that are not addressed by this process, please
submit a case through the [Ed-Fi Community Hub](https://community.ed-fi.org)

## Security Automation

The following tools have been implemented in this repository to automate aspects
of application security. Overall security posture and status is reviewed
regularly with the help of the [OpenSSF
Scorecard](https://securityscorecards.dev/), internal auditing, and external
auditing.

### Source Code

1. Static Application Security Testing (SAST) using
   [CodeQL](https://codeql.github.com/).
2. Dependency review and analysis using
   [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot)
   (nightly review of the `main` branch) and
   [actions/dependency-review-action](https://github.com/actions/dependency-review-action)
   (review of new dependencies in pull requests).
3. [Trojan
   Source](https://www.malwarebytes.com/blog/news/2021/11/trojan-source-hiding-malicious-code-in-plain-sight)
   detection.

### Development Pipeline

1. Direct write permissions in GitHub are limited to trusted development team
   members.
2. Pull requests are always required for merge to `main`, with at least one
   reviewer.
3. Changes to GitHub Actions workflows require approval from a core team member.
4. GitHub workflows are pinned to specific known SHA256 hash values, and builds
   will fail if there are unapproved Actions in the pull request.

### Published Packages

1. Packages are built and managed directly inside GitHub, not by developers.
