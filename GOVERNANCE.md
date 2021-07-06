# Process for becoming a maintainer

## a) Your organization is not yet a maintainer

- Express interest to the sponsors that your organization is interested in becoming a maintainer. Becoming a maintainer generally means that you are going to be spending substantial time on Backstage for the foreseeable future. You should have domain expertise and be extremely proficient in TypeScript.
- We will expect you to start contributing increasingly complicated PRs, under the guidance of the existing maintainers.
- We may ask you to do some PRs from our backlog.
- As you gain experience with the code base and our standards, we will ask you to do code reviews for incoming PRs.
- After a period of approximately 2-3 months of working together and making sure we see eye to eye, the existing sponsors and maintainers will confer and decide whether to grant maintainer status or not. We make no guarantees on the length of time this will take, but 2-3 months is the approximate goal.

## b) Your organization is currently a maintainer

To become a maintainer you need to demonstrate the following:

- First decide whether your organization really needs more people with maintainer access. Valid reasons are "blast radius", a large organization that is working on multiple unrelated projects, etc.
- Contact a sponsor for your organization and express interest.
- Start doing PRs and code reviews under the guidance of your maintainer.
- After a period of 1-2 months the existing sponsors will discuss granting maintainer access.
- Maintainer access can be upgraded to sponsor access after another conference of the existing sponsors.

# Maintainer responsibilities

- Monitor email aliases.
- Monitor Discord (delayed response is perfectly acceptable).
- Triage GitHub issues and perform pull request reviews for other maintainers and the community.
- Triage build issues - file issues for known flaky builds or bugs, and either fix or find someone to fix any master build breakages.
- During GitHub issue triage, apply all applicable ([labels](https://github.com/backstage/backstage/labels)) to each new issue. Labels are extremely useful for future issue follow up. Which labels to apply is somewhat subjective so just use your best judgment. A few of the most important labels that are not self explanatory are:
  - good first issue: Mark any issue that can reasonably be accomplished by a new contributor with this label.
  - help wanted: Unless it is immediately obvious that someone is going to work on an issue (and if so assign it), mark it help wanted.
- Make sure that ongoing PRs are moving forward at the right pace or closing them.
- Participate when called upon in the security release process. Note that although this should be a rare occurrence, if a serious vulnerability is found, the process may take up to several full days of work to implement. This reality should be taken into account when discussing time commitment obligations with employers.
- In general, continue to be willing to spend at least 25% of one's time working on Backstage (~1.25 business days per week).
- We currently maintain an "on-call" rotation within the maintainers. Each on-call is 1 week. Although all maintainers are welcome to perform all of the above tasks, it is the on-call maintainer's responsibility to triage incoming issues/questions and marshal ongoing work forward. To reiterate, it is not the responsibility of the on-call maintainer to answer all questions and do all reviews, but it is their responsibility to make sure that everything is being actively covered by someone.

# When does a maintainer lose maintainer status

If a maintainer is no longer interested or cannot perform the maintainer duties listed above, they should volunteer to be moved to emeritus status. In extreme cases this can also occur by a vote of the sponsors and maintainers per the voting process below.

# Reviewers

The project also contains a team called [@backstage/reviewers](https://github.com/orgs/backstage/teams/reviewers). This is the team of people who are the fallback in [`CODEOWNERS`](./.github/CODEOWNERS). This team will typically contain the maintainers, and a small number of additional people who are permitted to approve and merge pull requests. The purpose of this group is to offload some of the review work from the maintainers, simplifying and speeding up the review process for contributors.

This responsibility is distinct from the maintainer role. A reviewer must not approve and merge changes that have a level of impact that a maintainer should oversee; see below for clarification. For that class of changes, a reviewer can still review the pull request thoroughly without approving it (e.g. with a comment on the pull request), and is expected to notify `@backstage/maintainers` for final approval. Note that it is best to not use the GitHub review approve functionality for this, since that would let Hall of Fame members self-merge the pull request before maintainers get the chance to look at it.

The following is a non-exhaustive list of types of change, for which a reviewer should defer final decision and merge to a maintainer:

- A larger refactoring that significantly affects the structure of/between packages
- Changes that settle or alter the trajectory of contested ongoing topics in issues or elsewhere
- Changes that affect the [Architecture Decision Records](./docs/architecture-decisions)
- Changes to APIs that have large customer impact, such as the core APIs in `@backstage/core-*` packages, or significant `@backstage/cli` changes.
- Pull requests whose build checks are not passing fully
- Additions and removals of entire packages
- Releases (e.g. pull requests titled `Version Packages`)

A maintainer may suggest an addition to the reviewers team by opening a pull request that modifies [`OWNERS.md`](./OWNERS.md) accordingly. Prospective reviewers are not expected to do this themselves, but should rather ask a maintainer to sponsor their addition. All of the maintainers and sponsors are called to vote on the addition (see the section below about voting). If the vote passes, the pull request can be approved and merged, and the corresponding addition to the GitHub team can be made.

A reviewer can elect to remove themselves from the reviewers group by opening, or asking a maintainer to open, a pull request that modifies [`OWNERS.md`](./OWNERS.md) accordingly. A maintainer will approve and merge the pull request, and the corresponding removal from the GitHub team can be made.

A maintainer can call on the other maintainers and sponsors for a vote to remove a reviewer (see the section below about conflict resolution and voting). If the vote passes, a maintainer creates a pull request that modifies [`OWNERS.md`](./OWNERS.md) accordingly. After approval by another maintainer, the pull request can be merged, and the corresponding removal from the GitHub team can be made.

# Conflict resolution and voting

In general, we prefer that technical issues and membership are amicably worked out between the persons involved. If a dispute cannot be decided independently, the sponsors and maintainers can be called in to decide an issue. If the sponsors and maintainers themselves cannot decide an issue, the issue will be resolved by voting.

In all cases in this document where voting is mentioned, the voting process is a simple majority in which each sponsor receives two votes and each maintainer receives one vote. If such a majority is reached, the vote is said to have _passed_.

# Adding new projects to the Backstage GitHub organization

New projects will be added to the Backstage organization via GitHub issue discussion in one of the existing projects in the organization. Once sufficient discussion has taken place (~3-5 business days but depending on the volume of conversation), the maintainers of the project where the issue was opened (since different projects in the organization may have different maintainers) will decide whether the new project should be added. See the section above on voting if the maintainers cannot easily decide.
