/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactNode, useMemo, useState } from 'react';
import BadgeIcon from '@material-ui/icons/CallToAction';
import {
  EntityApiDefinitionCard,
  EntityConsumingComponentsCard,
  EntityHasApisCard,
  EntityProvidingComponentsCard,
  EntityProvidedApisCard,
  EntityConsumedApisCard,
} from '@backstage/plugin-api-docs';
import { EntityBadgesDialog } from '@backstage/plugin-badges';
import {
  EntityAboutCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLayout,
  EntityLinksCard,
  EntitySystemDiagramCard,
  EntitySwitch,
  isComponentType,
  isKind,
  EntityHasResourcesCard,
  EntityOrphanWarning,
  isOrphan,
} from '@backstage/plugin-catalog';
import {
  EntityCircleCIContent,
  isCircleCIAvailable,
} from '@backstage/plugin-circleci';
import {
  EntityCloudbuildContent,
  isCloudbuildAvailable,
} from '@backstage/plugin-cloudbuild';
import {
  EntityGithubActionsContent,
  EntityRecentGithubActionsRunsCard,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';
import {
  EntityJenkinsContent,
  EntityLatestJenkinsRunCard,
  isJenkinsAvailable,
} from '@backstage/plugin-jenkins';
import { EntityKafkaContent } from '@backstage/plugin-kafka';
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';
import {
  EntityLastLighthouseAuditCard,
  EntityLighthouseContent,
  isLighthouseAvailable,
} from '@backstage/plugin-lighthouse';
import {
  EntityGroupProfileCard,
  EntityMembersListCard,
  EntityOwnershipCard,
  EntityUserProfileCard,
} from '@backstage/plugin-org';
import {
  EntityPagerDutyCard,
  isPagerDutyAvailable,
} from '@backstage/plugin-pagerduty';
import {
  EntityRollbarContent,
  isRollbarAvailable,
} from '@backstage/plugin-rollbar';
import { EntitySentryContent } from '@backstage/plugin-sentry';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import { EntityTodoContent } from '@backstage/plugin-todo';
import { Button, Grid } from '@material-ui/core';
import {
  EntityBuildkiteContent,
  isBuildkiteAvailable,
} from '@roadiehq/backstage-plugin-buildkite';
import {
  EntityGithubInsightsContent,
  EntityGithubInsightsLanguagesCard,
  EntityGithubInsightsReadmeCard,
  EntityGithubInsightsReleasesCard,
  isGithubInsightsAvailable,
} from '@roadiehq/backstage-plugin-github-insights';
import {
  EntityGithubPullRequestsContent,
  EntityGithubPullRequestsOverviewCard,
  isGithubPullRequestsAvailable,
} from '@roadiehq/backstage-plugin-github-pull-requests';
import {
  EntityTravisCIContent,
  EntityTravisCIOverviewCard,
  isTravisciAvailable,
} from '@roadiehq/backstage-plugin-travis-ci';
import { EntityCodeCoverageContent } from '@backstage/plugin-code-coverage';
import { EmptyState } from '@backstage/core-components';

const EntityLayoutWrapper = (props: { children?: ReactNode }) => {
  const [badgesDialogOpen, setBadgesDialogOpen] = useState(false);

  const extraMenuItems = useMemo(() => {
    return [
      {
        title: 'Badges',
        Icon: BadgeIcon,
        onClick: () => setBadgesDialogOpen(true),
      },
    ];
  }, []);

  return (
    <>
      <EntityLayout UNSTABLE_extraContextMenuItems={extraMenuItems}>
        {props.children}
      </EntityLayout>
      <EntityBadgesDialog
        open={badgesDialogOpen}
        onClose={() => setBadgesDialogOpen(false)}
      />
    </>
  );
};

export const cicdContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isJenkinsAvailable}>
      <EntityJenkinsContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isBuildkiteAvailable}>
      <EntityBuildkiteContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isCircleCIAvailable}>
      <EntityCircleCIContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isCloudbuildAvailable}>
      <EntityCloudbuildContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isTravisciAvailable}>
      <EntityTravisCIContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <EntityGithubActionsContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
          >
            Read more
          </Button>
        }
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const cicdCard = (
  <EntitySwitch>
    <EntitySwitch.Case if={isJenkinsAvailable}>
      <Grid item sm={6}>
        <EntityLatestJenkinsRunCard branch="master" variant="gridItem" />
      </Grid>
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isTravisciAvailable}>
      <Grid item sm={6}>
        <EntityTravisCIOverviewCard />
      </Grid>
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isGithubActionsAvailable}>
      <Grid item sm={6}>
        <EntityRecentGithubActionsRunsCard limit={4} variant="gridItem" />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>
);

const errorsContent = (
  <EntitySwitch>
    <EntitySwitch.Case if={isRollbarAvailable}>
      <EntityRollbarContent />
    </EntitySwitch.Case>

    <EntitySwitch.Case>
      <EntitySentryContent />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <Grid item md={8} xs={12}>
      <EntityAboutCard variant="gridItem" />
    </Grid>

    <EntitySwitch>
      <EntitySwitch.Case if={isPagerDutyAvailable}>
        <Grid item md={6}>
          <EntityPagerDutyCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <Grid item md={4} xs={12}>
      <EntityLinksCard />
    </Grid>

    {cicdCard}

    <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isGithubInsightsAvailable(e))}>
        <Grid item md={6}>
          <EntityGithubInsightsLanguagesCard />
          <EntityGithubInsightsReleasesCard />
        </Grid>
        <Grid item md={6}>
          <EntityGithubInsightsReadmeCard maxHeight={350} />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={isLighthouseAvailable}>
        <Grid item sm={4}>
          <EntityLastLighthouseAuditCard variant="gridItem" />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={e => Boolean(isGithubPullRequestsAvailable(e))}>
        <Grid item sm={4}>
          <EntityGithubPullRequestsOverviewCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <Grid item md={8} xs={12}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
  </Grid>
);

const serviceEntityPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/errors" title="Errors">
      {errorsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/api" title="API">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityProvidedApisCard />
        </Grid>
        <Grid item md={6}>
          <EntityConsumedApisCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityDependsOnComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityDependsOnResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/kubernetes" title="Kubernetes">
      <EntityKubernetesContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      <EntityGithubPullRequestsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/code-insights" title="Code Insights">
      <EntityGithubInsightsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/code-coverage" title="Code Coverage">
      <EntityCodeCoverageContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/kafka" title="Kafka">
      <EntityKafkaContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/todos" title="TODOs">
      <EntityTodoContent />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const websiteEntityPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/lighthouse" title="Lighthouse">
      <EntityLighthouseContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/errors" title="Errors">
      {errorsContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityDependsOnComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityDependsOnResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/kubernetes" title="Kubernetes">
      <EntityKubernetesContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/pull-requests" title="Pull Requests">
      <EntityGithubPullRequestsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/code-insights" title="Code Insights">
      <EntityGithubInsightsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/code-coverage" title="Code Coverage">
      <EntityCodeCoverageContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/todos" title="TODOs">
      <EntityTodoContent />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const defaultEntityPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      <EntityTechdocsContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/todos" title="TODOs">
      <EntityTodoContent />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const componentPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('website')}>
      {websiteEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);

const apiPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item md={6}>
          <EntityAboutCard />
        </Grid>
        <Grid container item md={12}>
          <Grid item md={6}>
            <EntityProvidingComponentsCard />
          </Grid>
          <Grid item md={6}>
            <EntityConsumingComponentsCard />
          </Grid>
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/definition" title="Definition">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EntityApiDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const userPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EntityUserProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const groupPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EntityGroupProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
        <Grid item xs={12}>
          <EntityMembersListCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const systemPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntitySystemDiagramCard />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

const domainPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
