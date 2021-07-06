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
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import BuildIcon from '@material-ui/icons/Build';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TimelineIcon from '@material-ui/icons/Timeline';
import WebIcon from '@material-ui/icons/Web';
import Typography from '@material-ui/core/Typography';
import { ilertApiRef } from '../../api';
import { AlertSource, UptimeMonitor } from '../../types';

import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
} from '@backstage/core-components';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';

export const ILertCardActionsHeader = ({
  alertSource,
  setAlertSource,
  setIsNewIncidentModalOpened,
  setIsMaintenanceModalOpened,
  uptimeMonitor,
}: {
  alertSource: AlertSource | null;
  setAlertSource: (alertSource: AlertSource) => void;
  setIsNewIncidentModalOpened: (isOpen: boolean) => void;
  setIsMaintenanceModalOpened: (isOpen: boolean) => void;
  uptimeMonitor: UptimeMonitor | null;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisableModalOpened, setIsDisableModalOpened] = React.useState(false);

  const handleCreateNewIncident = () => {
    setIsNewIncidentModalOpened(true);
  };

  const handleEnableAlertSource = async () => {
    try {
      if (!alertSource) {
        return;
      }
      setIsLoading(true);
      const newAlertSource = await ilertApi.enableAlertSource(alertSource);
      alertApi.post({ message: 'Alert source enabled.' });
      setIsLoading(false);
      setAlertSource(newAlertSource);
    } catch (err) {
      setIsLoading(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };
  const handleDisableAlertSource = async () => {
    try {
      if (!alertSource) {
        return;
      }
      setIsDisableModalOpened(false);
      setIsLoading(true);
      const newAlertSource = await ilertApi.disableAlertSource(alertSource);
      alertApi.post({ message: 'Alert source disabled.' });
      setIsLoading(false);
      setAlertSource(newAlertSource);
    } catch (err) {
      setIsLoading(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleDisableAlertSourceWarningOpen = () => {
    setIsDisableModalOpened(true);
  };

  const handleDisableAlertSourceWarningClose = () => {
    setIsDisableModalOpened(false);
  };

  const handleMaintenanceAlertSource = () => {
    setIsMaintenanceModalOpened(true);
  };

  const alertSourceLink: IconLinkVerticalProps = {
    label: 'Alert Source',
    href: ilertApi.getAlertSourceDetailsURL(alertSource),
    icon: <WebIcon />,
  };

  const createIncidentLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    onClick: handleCreateNewIncident,
    icon: <AlarmAddIcon />,
    color: 'secondary',
    disabled:
      !alertSource ||
      alertSource.status === 'DISABLED' ||
      alertSource.status === 'IN_MAINTENANCE',
  };

  const enableAlertSourceLink: IconLinkVerticalProps = {
    label: 'Enable',
    onClick: handleEnableAlertSource,
    icon: <PlayArrowIcon />,
    disabled: !alertSource || isLoading,
  };

  const disableAlertSourceLink: IconLinkVerticalProps = {
    label: 'Disable',
    onClick: handleDisableAlertSourceWarningOpen,
    icon: <PauseIcon />,
    disabled: !alertSource || isLoading,
  };

  const maintenanceAlertSourceLink: IconLinkVerticalProps = {
    label: 'Immediate maintenance',
    onClick: handleMaintenanceAlertSource,
    icon: <BuildIcon />,
    disabled: !alertSource || isLoading,
  };

  const uptimeMonitorReportLink: IconLinkVerticalProps = {
    label: 'Uptime Report',
    href: uptimeMonitor ? uptimeMonitor.shareUrl : '',
    icon: <TimelineIcon />,
    disabled: !alertSource || !uptimeMonitor || isLoading,
  };

  const links: IconLinkVerticalProps[] = [
    alertSourceLink,
    createIncidentLink,
    alertSource && alertSource.active
      ? disableAlertSourceLink
      : enableAlertSourceLink,
  ];

  if (alertSource && alertSource.integrationType === 'MONITOR') {
    links.push(uptimeMonitorReportLink);
  }

  if (alertSource && alertSource.status !== 'IN_MAINTENANCE') {
    links.push(maintenanceAlertSourceLink);
  }

  return (
    <>
      <HeaderIconLinkRow links={links} />
      <Dialog
        open={isDisableModalOpened}
        onClose={handleDisableAlertSourceWarningClose}
        aria-labelledby="alert-source-disable-form-title"
      >
        <DialogTitle id="alert-source-disable-form-title">
          Disable alert source
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">
            <Typography variant="body1" align="justify">
              Do you really want to disable this alert source? A disabled alert
              source cannot create new incidents.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDisableAlertSource}
            color="secondary"
            variant="contained"
          >
            Disable
          </Button>
          <Button
            onClick={handleDisableAlertSourceWarningClose}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
