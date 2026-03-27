# Plan: Sync Workspace and Clean Up Branches

## Objective
Commit the current uncommitted work on `feat/e2e-auth-bypass`, raise and merge a Pull Request, and reset the local environment to a pristine state on the `main` branch by cleaning up all feature branches.

## Proposed Steps

1. **Commit Local Changes**
   - Stage all tracked modifications (README, images, E2E app changes) and the untracked `.agents/` configuration directory.
   - Commit with a descriptive message: `feat(e2e): finalize testing bypass and add agent guidelines`.

2. **Push & Create Pull Request**
   - Push the updated `feat/e2e-auth-bypass` branch to the remote repository.
   - Create a Pull Request against `main` using the GitHub CLI (`gh pr create`).

3. **Merge Pull Request**
   - Automatically merge the newly created PR into `main` using `gh pr merge --squash --delete-branch`. This will squash the commits and delete the remote feature branch.

4. **Sync Local `main`**
   - Checkout the `main` branch locally.
   - Pull the latest changes from the remote repository to ensure your local `main` includes the squashed commits.

5. **Clean Up Local Branches**
   - Force-delete the old local feature branches to clean up your workspace:
     - `feat/e2e-auth-bypass`
     - `fix/core-security`
     - `fix/readme-images`

## Verification
- Run `git status` to ensure `main` is clean and up-to-date.
- Run `git branch` to verify only the `main` branch remains locally.
- Run `gh pr list` to confirm no open PRs are lingering.