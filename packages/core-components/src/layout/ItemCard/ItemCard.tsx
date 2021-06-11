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
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
} from '@material-ui/core';
import React, { ReactNode } from 'react';
import { Button } from '../../components';
import { ItemCardHeader } from './ItemCardHeader';

type ItemCardProps = {
  description?: string;
  tags?: string[];
  title: string;
  /** @deprecated Use subtitle instead */
  type?: string;
  subtitle?: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
};

/**
 * This card type has been deprecated. Instead use plain MUI Card and helpers
 * where appropriate.
 *
 * <code>
 * <!--
 *   <Card>
 *     <CardMedia>
 *       <ItemCardHeader title="My Card" subtitle="neat!" />
 *     </CardMedia>
 *     <CardContent>
 *        Some text
 *     </CardContent>
 *     <CardActions>
 *       <Button color="primary" to="https://backstage.io">
 *         Get Started
 *       </Button>
 *     </CardActions>
 *   </Card>
 * -->
 * </code>
 *
 * @deprecated Use plain MUI <Card> and composable helpers instead.
 * @see https://material-ui.com/components/cards/
 */
export const ItemCard = ({
  description,
  tags,
  title,
  type,
  subtitle,
  label,
  onClick,
  href,
}: ItemCardProps) => {
  return (
    <Card>
      <CardMedia>
        <ItemCardHeader title={title} subtitle={subtitle || type} />
      </CardMedia>
      <CardContent>
        {tags?.length ? (
          <Box>
            {tags.map((tag, i) => (
              <Chip size="small" label={tag} key={i} />
            ))}
          </Box>
        ) : null}
        {description}
      </CardContent>
      <CardActions>
        {!href && (
          <Button to="#" onClick={onClick} color="primary">
            {label}
          </Button>
        )}
        {href && (
          <Button to={href} color="primary">
            {label}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
