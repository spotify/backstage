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
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { ilertApiRef } from '../../api';
import { UptimeMonitor } from '../../types';

import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';

export const UptimeMonitorActionsMenu = ({
  uptimeMonitor,
  onUptimeMonitorChanged,
}: {
  uptimeMonitor: UptimeMonitor;
  onUptimeMonitorChanged?: (uptimeMonitor: UptimeMonitor) => void;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const callback = onUptimeMonitorChanged || ((_: UptimeMonitor): void => {});

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handlePause = async (): Promise<void> => {
    try {
      const newUptimeMonitor = await ilertApi.pauseUptimeMonitor(uptimeMonitor);
      handleCloseMenu();
      alertApi.post({ message: 'Uptime monitor paused.' });

      callback(newUptimeMonitor);
    } catch (err) {
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleResume = async (): Promise<void> => {
    try {
      const newUptimeMonitor = await ilertApi.resumeUptimeMonitor(
        uptimeMonitor,
      );
      handleCloseMenu();
      alertApi.post({ message: 'Uptime monitor resumed.' });

      callback(newUptimeMonitor);
    } catch (err) {
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleOpenReport = async (): Promise<void> => {
    try {
      const um = await ilertApi.fetchUptimeMonitor(uptimeMonitor.id);
      handleCloseMenu();
      window.open(um.shareUrl, '_blank');
    } catch (err) {
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`uptime-monitor-actions-menu-${uptimeMonitor.id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { maxHeight: 48 * 4.5 },
        }}
      >
        {uptimeMonitor.paused ? (
          <MenuItem key="ack" onClick={handleResume}>
            <Typography variant="inherit" noWrap>
              Resume
            </Typography>
          </MenuItem>
        ) : null}

        {!uptimeMonitor.paused ? (
          <MenuItem key="close" onClick={handlePause}>
            <Typography variant="inherit" noWrap>
              Pause
            </Typography>
          </MenuItem>
        ) : null}

        <MenuItem key="report" onClick={handleCloseMenu}>
          <Typography variant="inherit" noWrap>
            <Link to="#" onClick={handleOpenReport}>
              View Report
            </Link>
          </Typography>
        </MenuItem>

        <MenuItem key="details" onClick={handleCloseMenu}>
          <Typography variant="inherit" noWrap>
            <Link to={ilertApi.getUptimeMonitorDetailsURL(uptimeMonitor)}>
              View in iLert
            </Link>
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
