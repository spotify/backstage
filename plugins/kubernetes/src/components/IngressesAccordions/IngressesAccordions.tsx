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

import React, { useContext } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ExtensionsV1beta1Ingress } from '@kubernetes/client-node';
import { IngressDrawer } from './IngressDrawer';
import { GroupedResponsesContext } from '../../hooks';
import { StructuredMetadataTable } from '@backstage/core-components';

type IngressesAccordionsProps = {};

type IngressAccordionProps = {
  ingress: ExtensionsV1beta1Ingress;
};

type IngressSummaryProps = {
  ingress: ExtensionsV1beta1Ingress;
};

const IngressSummary = ({ ingress }: IngressSummaryProps) => {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid xs={3} item>
        <IngressDrawer ingress={ingress} />
      </Grid>

      <Grid item xs={1}>
        <Divider style={{ height: '5em' }} orientation="vertical" />
      </Grid>
    </Grid>
  );
};

type IngressCardProps = {
  ingress: ExtensionsV1beta1Ingress;
};

const IngressCard = ({ ingress }: IngressCardProps) => {
  return (
    <StructuredMetadataTable
      metadata={{
        ...ingress.spec,
      }}
    />
  );
};

const IngressAccordion = ({ ingress }: IngressAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <IngressSummary ingress={ingress} />
      </AccordionSummary>
      <AccordionDetails>
        <IngressCard ingress={ingress} />
      </AccordionDetails>
    </Accordion>
  );
};
export const IngressesAccordions = ({}: IngressesAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      {groupedResponses.ingresses.map((ingress, i) => (
        <Grid item key={i} xs>
          <IngressAccordion ingress={ingress} />
        </Grid>
      ))}
    </Grid>
  );
};
