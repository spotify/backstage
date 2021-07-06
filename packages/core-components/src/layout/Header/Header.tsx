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

import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from '../../components/Link';
import { Breadcrumbs } from '../Breadcrumbs';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  header: {
    gridArea: 'pageHeader',
    padding: theme.spacing(3),
    minHeight: 118,
    width: '100%',
    boxShadow: '0 0 8px 3px rgba(20, 20, 20, 0.3)',
    position: 'relative',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundImage: theme.page.backgroundImage,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  leftItemsBox: {
    flex: '1 1 auto',
  },
  rightItemsBox: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  title: {
    color: theme.palette.bursts.fontColor,
    lineHeight: '1.0em',
    wordBreak: 'break-all',
    fontSize: 'calc(24px + 6 * ((100vw - 320px) / 680))',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.0em',
  },
  type: {
    textTransform: 'uppercase',
    fontSize: 11,
    opacity: 0.8,
    marginBottom: theme.spacing(1),
    color: theme.palette.bursts.fontColor,
  },
  breadcrumb: {
    fontSize: 'calc(15px + 1 * ((100vw - 320px) / 680))',
    color: theme.palette.bursts.fontColor,
  },
  breadcrumbType: {
    fontSize: 'inherit',
    opacity: 0.7,
    marginRight: -theme.spacing(0.3),
    marginBottom: theme.spacing(0.3),
  },
  breadcrumbTitle: {
    fontSize: 'inherit',
    marginLeft: -theme.spacing(0.3),
    marginBottom: theme.spacing(0.3),
  },
}));

type HeaderStyles = ReturnType<typeof useStyles>;

type Props = {
  component?: ReactNode;
  pageTitleOverride?: string;
  style?: CSSProperties;
  subtitle?: ReactNode;
  title: ReactNode;
  tooltip?: string;
  type?: string;
  typeLink?: string;
};

type TypeFragmentProps = {
  classes: HeaderStyles;
  pageTitle: string | ReactNode;
  type?: Props['type'];
  typeLink?: Props['typeLink'];
};

type TitleFragmentProps = {
  classes: HeaderStyles;
  pageTitle: string | ReactNode;
  tooltip?: Props['tooltip'];
};

type SubtitleFragmentProps = {
  classes: HeaderStyles;
  subtitle?: Props['subtitle'];
};

const TypeFragment = ({
  type,
  typeLink,
  classes,
  pageTitle,
}: TypeFragmentProps) => {
  if (!type) {
    return null;
  }

  if (!typeLink) {
    return <Typography className={classes.type}>{type}</Typography>;
  }

  return (
    <Breadcrumbs className={classes.breadcrumb}>
      <Link to={typeLink}>{type}</Link>
      <Typography>{pageTitle}</Typography>
    </Breadcrumbs>
  );
};

const TitleFragment = ({ pageTitle, classes, tooltip }: TitleFragmentProps) => {
  const FinalTitle = (
    <Typography className={classes.title} variant="h1">
      {pageTitle}
    </Typography>
  );

  if (!tooltip) {
    return FinalTitle;
  }

  return (
    <Tooltip title={tooltip} placement="top-start">
      {FinalTitle}
    </Tooltip>
  );
};

const SubtitleFragment = ({ classes, subtitle }: SubtitleFragmentProps) => {
  if (!subtitle) {
    return null;
  }

  if (typeof subtitle !== 'string') {
    return <>{subtitle}</>;
  }

  return (
    <Typography
      className={classes.subtitle}
      variant="subtitle2"
      component="span"
    >
      {subtitle}
    </Typography>
  );
};

export const Header = ({
  children,
  pageTitleOverride,
  style,
  subtitle,
  title,
  tooltip,
  type,
  typeLink,
}: PropsWithChildren<Props>) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  const documentTitle = pageTitleOverride || title;
  const pageTitle = title || pageTitleOverride;
  const titleTemplate = `${documentTitle} | %s | ${appTitle}`;
  const defaultTitle = `${documentTitle} | ${appTitle}`;

  return (
    <>
      <Helmet titleTemplate={titleTemplate} defaultTitle={defaultTitle} />
      <header style={style} className={classes.header}>
        <div className={classes.leftItemsBox}>
          <TypeFragment
            classes={classes}
            type={type}
            typeLink={typeLink}
            pageTitle={pageTitle}
          />
          <TitleFragment
            classes={classes}
            pageTitle={pageTitle}
            tooltip={tooltip}
          />
          <SubtitleFragment classes={classes} subtitle={subtitle} />
        </div>
        <div className={classes.rightItemsBox}>{children}</div>
      </header>
    </>
  );
};
