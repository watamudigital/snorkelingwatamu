# GitHub Actions → Vercel: Snorkeling Watamu pilot

## Reason

The existing Vercel Git integration correctly rejects production deployments from an author who is not a member of the Equipe Creative Agency Vercel Pro team. A GitHub status or a deploy hook is **not a permissions override**. Instead, this workflow proposes a deployment made by Vercel CLI running in reviewed GitHub Actions, under its own explicitly configured credential.

**State: PROPOSED / NOT ACTIVE.** This pull request must not be merged until the authorization and branch-security checks below are satisfied. The current working Vercel deployment and domain remain untouched.

## Security gates before enabling

1. Review the risk of an API token for the existing Equipe Vercel Pro team: such a token can access more than one project. **Do not place a broad Equipe-team token in a repository where third-party collaborators can change `main` or its workflows.** Prefer a separate Watamu Digital Vercel team and dedicated token, or a dedicated constrained deployment service.
2. Protect `main` with review by a trusted repository maintainer and prevent direct pushes. GitHub Free organization **private** repositories do not offer all required branch protection/ruleset features; verify the Watamu Digital GitHub plan and upgrade when necessary.
3. Prevent changes to `.github/workflows/**`, `vercel.json`, build scripts and deployment settings without trusted review (CODEOWNERS / branch rules if available). Do not run privileged deploys from untrusted PR code, forks or unreviewed branches.
4. Configure a GitHub `production` environment with access to the `VERCEL_TOKEN` secret and limit deployment branches to `main`; note that required environment reviewers are not available for private repos on GitHub Free/Pro/Team. If this restriction cannot be provided, do not provision the token until a secured alternative is chosen.
5. Configure repository/environment variables:
   - `VERCEL_ORG_ID`: existing Equipe team ID (only for this pilot)
   - `VERCEL_PROJECT_ID`: Snorkeling Watamu project ID
   - `VERCEL_CLI_VERSION`: reviewed, exact published CLI version; never `latest`
   - `VERCEL_TOKEN`: secret created in Vercel and entered directly into GitHub; **never paste the token into ChatGPT, source files, logs, or a pull request**.
6. The workflow checks the exact expected Vercel team and project IDs before using the token. For a dedicated Watamu Vercel team, **update both allowlisted IDs** before enabling.
7. Test on a reviewed dummy commit; check the Vercel deployment URL, output, custom domain, rollback procedure and site behavior.
8. **Only after a tested successful Actions deployment**, turn off duplicate Vercel Git builds by setting `git.deploymentEnabled: false` in `vercel.json` and redeploy with the configured CI.

## Pipeline

`Juma (branch + pull request)` → `trusted review/merge to main` → `static checks` → `GitHub environment production` → `Vercel CLI build --prod` → `Vercel deploy --prebuilt --prod`.

This is an alternate source-driven CI deployment, **not an automatic approval of an unauthorized Git commit**.

## Scope

This PR covers **only** `watamudigital/snorkelingwatamu`, the project where Vercel showed BLOCKED deployments for commits by `luisaperla85-gif`. Repeat only after this pilot passes; each other repository needs its own project ID, team decision, and secrets.

See official docs:
- https://vercel.com/docs/git
- https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
- https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets
