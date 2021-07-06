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

import AsyncApi from '@asyncapi/react-component';
import '@asyncapi/react-component/lib/styles/fiori.css';
import { fade, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    '& .asyncapi': {
      'font-family': 'inherit',
      background: 'none',
    },
    '& h2': {
      ...theme.typography.h6,
    },
    '& .text-teal': {
      color: theme.palette.primary.main,
    },
    '& button': {
      ...theme.typography.button,
      background: 'none',
      boxSizing: 'border-box',
      minWidth: 64,
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create(
        ['background-color', 'box-shadow', 'border'],
        {
          duration: theme.transitions.duration.short,
        },
      ),
      padding: '5px 15px',
      color: theme.palette.primary.main,
      border: `1px solid ${fade(theme.palette.primary.main, 0.5)}`,
      '&:hover': {
        textDecoration: 'none',
        '&.Mui-disabled': {
          backgroundColor: 'transparent',
        },
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: fade(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    },
    '& .asyncapi__collapse-button:hover': {
      color: theme.palette.primary.main,
    },
    '& button.asyncapi__toggle-button': {
      'min-width': 'inherit',
    },
    '& .asyncapi__info-list li': {
      'border-color': theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.text.primary,
        'border-color': theme.palette.primary.main,
        'background-color': theme.palette.primary.main,
      },
    },
    '& .asyncapi__info-list li a': {
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.getContrastText(theme.palette.primary.main),
      },
    },
    '& .asyncapi__enum': {
      color: theme.palette.secondary.main,
    },
    '& .asyncapi__info, .asyncapi__channel, .asyncapi__channels > div, .asyncapi__schema, .asyncapi__channel-operations-list .asyncapi__messages-list-item .asyncapi__message, .asyncapi__message, .asyncapi__server, .asyncapi__servers > div, .asyncapi__messages > div, .asyncapi__schemas > div': {
      'background-color': 'inherit',
    },
    '& .asyncapi__channel-parameters-header, .asyncapi__channel-operations-header, .asyncapi__channel-operation-oneOf-subscribe-header, .asyncapi__channel-operation-oneOf-publish-header, .asyncapi__channel-operation-message-header,  .asyncapi__message-header, .asyncapi__message-header-title, .asyncapi__message-header-title > h3, .asyncapi__bindings, .asyncapi__bindings-header, .asyncapi__bindings-header > h4': {
      'background-color': 'inherit',
      color: theme.palette.text.primary,
    },
    '& .asyncapi__additional-properties-notice': {
      color: theme.palette.text.hint,
    },
    '& .asyncapi__code, .asyncapi__code-pre': {
      background: theme.palette.background.default,
    },
    '& .asyncapi__schema-example-header-title': {
      color: theme.palette.text.secondary,
    },
    '& .asyncapi__message-headers-header, .asyncapi__message-payload-header, .asyncapi__server-variables-header, .asyncapi__server-security-header': {
      'background-color': 'inherit',
      color: theme.palette.text.secondary,
    },
    '& .asyncapi__table-header': {
      background: theme.palette.background.default,
    },
    '& .asyncapi__table-body': {
      color: theme.palette.text.primary,
    },
    '& .asyncapi__server-security-flow': {
      background: theme.palette.background.default,
      border: 'none',
    },
    '& .asyncapi__server-security-flows-list a': {
      color: theme.palette.primary.main,
    },
    '& .asyncapi__table-row--nested': {
      color: theme.palette.text.secondary,
    },
  },
}));

type Props = {
  definition: string;
};

export const AsyncApiDefinitionWidget = ({ definition }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AsyncApi schema={definition} />
    </div>
  );
};
