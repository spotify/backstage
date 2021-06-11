/*
 * Copyright 2020 Spotify AB
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
import { Button, ItemCardHeader, useRouteRef } from '@backstage/core';
import { BackstageTheme, pageTheme } from '@backstage/theme';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Link,
  makeStyles,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import { generatePath } from 'react-router';
import { rootRouteRef } from '../../routes';
import {
  TemplateEntityV1alpha1,
  Entity,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { FavouriteTemplate } from '../FavouriteTemplate/FavouriteTemplate';
import {
  getEntityRelations,
  EntityRefLinks,
} from '@backstage/plugin-catalog-react';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    position: 'relative',
  },
  title: {
    backgroundImage: ({ backgroundImage }: any) => backgroundImage,
  },
  box: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
    paddingBottom: '0.8em',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 1,
    paddingBottom: '0.2rem',
  },
}));

const useDeprecationStyles = makeStyles(theme => ({
  deprecationIcon: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(3.5),
    padding: '0.25rem',
  },
  link: {
    color: theme.palette.warning.light,
  },
}));

export type TemplateCardProps = {
  template: TemplateEntityV1alpha1;
  deprecated?: boolean;
};

type TemplateProps = {
  description: string;
  tags: string[];
  title: string;
  type: string;
  name: string;
};

const getTemplateCardProps = (
  template: TemplateEntityV1alpha1,
): TemplateProps & { key: string } => {
  return {
    key: template.metadata.uid!,
    name: template.metadata.name,
    title: `${(template.metadata.title || template.metadata.name) ?? ''}`,
    type: template.spec.type ?? '',
    description: template.metadata.description ?? '-',
    tags: (template.metadata?.tags as string[]) ?? [],
  };
};

const DeprecationWarning = () => {
  const styles = useDeprecationStyles();

  const Title = (
    <Typography style={{ padding: 10, maxWidth: 300 }}>
      This template syntax is deprecated. Click for more info.
    </Typography>
  );

  return (
    <div className={styles.deprecationIcon}>
      <Tooltip title={Title}>
        <Link
          href="https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2"
          className={styles.link}
        >
          <WarningIcon />
        </Link>
      </Tooltip>
    </div>
  );
};

export const TemplateCard = ({ template, deprecated }: TemplateCardProps) => {
  const backstageTheme = useTheme<BackstageTheme>();
  const rootLink = useRouteRef(rootRouteRef);
  const templateProps = getTemplateCardProps(template);
  const ownedByRelations = getEntityRelations(
    template as Entity,
    RELATION_OWNED_BY,
  );
  const themeId = pageTheme[templateProps.type] ? templateProps.type : 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({ backgroundImage: theme.backgroundImage });
  const href = generatePath(`${rootLink()}/templates/:templateName`, {
    templateName: templateProps.name,
  });

  return (
    <Card>
      <CardMedia className={classes.cardHeader}>
        <FavouriteTemplate entity={template} />
        {deprecated && <DeprecationWarning />}
        <ItemCardHeader
          title={templateProps.title}
          subtitle={templateProps.type}
          classes={{ root: classes.title }}
        />
      </CardMedia>
      <CardContent style={{ display: 'grid' }}>
        <Box className={classes.box}>
          <Typography variant="body2" className={classes.label}>
            Description
          </Typography>
          {templateProps.description}
        </Box>
        <Box className={classes.box}>
          <Typography variant="body2" className={classes.label}>
            Owner
          </Typography>
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="Group" />
        </Box>
        <Box>
          <Typography variant="body2" className={classes.label}>
            Tags
          </Typography>
          {templateProps.tags?.map(tag => (
            <Chip size="small" label={tag} key={tag} />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          to={href}
          aria-label={`Choose ${templateProps.title}`}
        >
          Choose
        </Button>
      </CardActions>
    </Card>
  );
};
