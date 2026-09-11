# Security

## Reporting a vulnerability

This repository is a distribution hub: two guides, a plugin marketplace manifest, a frozen copy of brand assets, and one static gallery page. It runs no servers and ships no install code of its own. The install commands in the README call the skills CLI, which clones the skill repositories from GitHub.

If you find a problem, such as a command or link in the guides or the manifest pointing somewhere it should not, a leaked credential in the history, or an issue in the frozen gallery page, email **ccreative@azmx.sa**. Please do not open a public issue for security reports. You will get an acknowledgement within three working days.

## What is in scope

- `.claude-plugin/marketplace.json` and the three plugin sources it points at.
- `README.md` and `INSTALL.md`: every command and link a reader is asked to trust.
- `brand/index.html`: the frozen gallery page served at `gamaleldientarek.github.io/azmx/brand/`.
- The frozen assets under `brand/`, `colab/` and `majarah/`. They must never change; CI fails any pull request that touches them.

A vulnerability in a skill itself belongs to that skill's repository: [azmx-brand](https://github.com/Gamaleldientarek/azmx-brand/blob/main/SECURITY.md), [colab-design](https://github.com/Gamaleldientarek/colab-design/blob/main/SECURITY.md), [majarah-design](https://github.com/Gamaleldientarek/majarah-design).

## How secrets are handled

- Nothing in this repository needs a credential, and none is committed. `.gitignore` covers `.env*`, key and certificate files and package-manager auth files.
- GitHub secret scanning and push protection are enabled on the repository, and `.github/workflows/secret-scan.yml` runs gitleaks over the full history on every push and pull request. Known false positives (the public Figma file key of the token library) are allowlisted in `.gitleaks.toml`.
- The frozen assets are public brand material, published with AZMX's approval. They contain no credentials.

## Maintainers

`main` is protected by a ruleset: changes land through pull requests, force pushes and branch deletion are blocked, and the `validate` and `gitleaks` checks must pass. Review secret-scan alerts privately; never paste a suspected credential into a public issue. Revoke an exposed credential before cleaning history.
