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
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import { makeStyles } from '@material-ui/core/styles';
import { OnCall } from '../../types';
import { ilertApiRef } from '../../api';
import { DateTime as dt } from 'luxon';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  listItemPrimary: {
    fontWeight: 'bold',
  },
  fistItemLine: {
    position: 'absolute',
    bottom: 0,
    height: '50%',
    left: 36,
  },
  lastItemLine: {
    position: 'absolute',
    top: 0,
    height: '50%',
    left: 36,
  },
  itemLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
    left: 36,
  },
});

export const ILertCardOnCallItem = ({
  onCall,
  fistItem = false,
  lastItem = false,
}: {
  onCall: OnCall;
  fistItem?: boolean;
  lastItem?: boolean;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles();

  if (!onCall || !onCall.user) {
    return null;
  }

  const phoneNumber = ilertApi.getUserPhoneNumber(onCall.user);
  const escalationRepeating = onCall.escalationPolicy.repeating;
  const escalationSeconds =
    onCall.escalationPolicy.escalationRules[onCall.escalationLevel - 1]
      .escalationTimeout;
  const escalationHoursOnly = Math.floor(escalationSeconds / 60);
  const escalationMinutesOnly = escalationSeconds % 60;

  let escalationText = '';
  if (!lastItem || (lastItem && escalationRepeating)) {
    escalationText = 'escalate';
    if (escalationSeconds === 0) {
      escalationText += ' immediately';
    } else {
      escalationText += ' after';
      if (escalationHoursOnly > 0) {
        escalationText += ` ${escalationHoursOnly} ${
          escalationHoursOnly === 1 ? 'hour' : 'hours'
        }`;
      }
      if (escalationMinutesOnly > 0 || escalationSeconds === 0) {
        escalationText += ` ${escalationMinutesOnly} ${
          escalationMinutesOnly === 1 ? 'minute' : 'minutes'
        }`;
      }
    }
  }

  return (
    <ListItem>
      {fistItem ? (
        <Divider orientation="vertical" className={classes.fistItemLine} />
      ) : null}
      {lastItem ? (
        <Divider orientation="vertical" className={classes.lastItemLine} />
      ) : null}
      {!fistItem && !lastItem ? (
        <Divider orientation="vertical" className={classes.itemLine} />
      ) : null}
      <ListItemIcon>
        <Tooltip
          title={`Escalation level #${onCall.escalationLevel}`}
          placement="top"
        >
          <Avatar>{onCall.escalationLevel}</Avatar>
        </Tooltip>
      </ListItemIcon>
      {onCall.schedule ? (
        <Tooltip
          title={
            'On call shift ' +
            `${dt.fromISO(onCall.start).toFormat('D MMM, HH:mm')} - ` +
            `${dt.fromISO(onCall.end).toFormat('D MMM, HH:mm')}`
          }
          placement="top-start"
        >
          <ListItemText
            primary={
              <Typography className={classes.listItemPrimary}>
                {ilertApi.getUserInitials(onCall.user)}
              </Typography>
            }
            secondary={escalationText}
          />
        </Tooltip>
      ) : (
        <ListItemText
          primary={
            <Typography className={classes.listItemPrimary}>
              {ilertApi.getUserInitials(onCall.user)}
            </Typography>
          }
          secondary={escalationText}
        />
      )}
      <ListItemSecondaryAction>
        {phoneNumber ? (
          <Tooltip title="Call to user" placement="top">
            <IconButton href={`tel:${phoneNumber}`}>
              <PhoneIcon color="secondary" />
            </IconButton>
          </Tooltip>
        ) : null}
        <Tooltip
          title={`Send e-mail to user ${onCall.user.email}`}
          placement="top"
        >
          <IconButton href={`mailto:${onCall.user.email}`}>
            <EmailIcon color="primary" />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
