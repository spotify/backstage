/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DefaultCustomResourceDrawer } from './DefaultCustomResourceDrawer';
import { StructuredMetadataTable } from '@backstage/core-components';

type DefaultCustomResourceAccordionsProps = {
  customResources: any[];
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type DefaultCustomResourceAccordionProps = {
  customResource: any;
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type DefaultCustomResourceSummaryProps = {
  customResource: any;
  customResourceName: string;
  children?: React.ReactNode;
};

const DefaultCustomResourceSummary = ({
  customResource,
  customResourceName,
}: DefaultCustomResourceSummaryProps) => {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid xs={3} item>
        <DefaultCustomResourceDrawer
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </Grid>
      <Grid item xs={1}>
        <Divider style={{ height: '5em' }} orientation="vertical" />
      </Grid>
    </Grid>
  );
};

const DefaultCustomResourceAccordion = ({
  customResource,
  customResourceName,
  defaultExpanded,
}: DefaultCustomResourceAccordionProps) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <DefaultCustomResourceSummary
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </AccordionSummary>
      <AccordionDetails>
        {customResource.hasOwnProperty('status') && (
          <StructuredMetadataTable metadata={customResource.status} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const DefaultCustomResourceAccordions = ({
  customResources,
  customResourceName,
  defaultExpanded = false,
}: DefaultCustomResourceAccordionsProps) => {
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      {customResources.map((cr, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <DefaultCustomResourceAccordion
              defaultExpanded={defaultExpanded}
              customResource={cr}
              customResourceName={customResourceName}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
