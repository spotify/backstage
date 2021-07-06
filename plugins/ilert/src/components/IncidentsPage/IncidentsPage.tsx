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
import { AuthenticationError } from '@backstage/errors';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { IncidentsTable } from './IncidentsTable';
import { MissingAuthorizationHeaderError } from '../Errors';
import { useIncidents } from '../../hooks/useIncidents';
import { IncidentNewModal } from '../Incident/IncidentNewModal';
import {
  Content,
  ContentHeader,
  SupportButton,
  ResponseErrorPanel,
} from '@backstage/core-components';

export const IncidentsPage = () => {
  const [
    { tableState, states, incidents, incidentsCount, isLoading, error },
    {
      onIncidentStatesChange,
      onChangePage,
      onChangeRowsPerPage,
      onIncidentChanged,
      refetchIncidents,
      setIsLoading,
    },
  ] = useIncidents(true);

  const [isModalOpened, setIsModalOpened] = React.useState(false);

  const handleCreateNewIncidentClick = () => {
    setIsModalOpened(true);
  };

  if (error) {
    if (error instanceof AuthenticationError) {
      return (
        <Content>
          <MissingAuthorizationHeaderError />
        </Content>
      );
    }

    return (
      <Content>
        <ResponseErrorPanel error={error} />
      </Content>
    );
  }

  return (
    <Content>
      <ContentHeader title="Incidents">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleCreateNewIncidentClick}
        >
          Create Incident
        </Button>
        <IncidentNewModal
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          refetchIncidents={refetchIncidents}
        />
        <SupportButton>
          This helps you to bring iLert into your developer portal.
        </SupportButton>
      </ContentHeader>
      <IncidentsTable
        incidents={incidents}
        incidentsCount={incidentsCount}
        tableState={tableState}
        states={states}
        onIncidentChanged={onIncidentChanged}
        onIncidentStatesChange={onIncidentStatesChange}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Content>
  );
};
