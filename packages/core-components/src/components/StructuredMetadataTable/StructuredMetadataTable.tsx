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

import React, { Fragment, ReactElement } from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core';
import startCase from 'lodash/startCase';

import {
  MetadataTable,
  MetadataTableItem,
  MetadataList,
  MetadataListItem,
} from './MetadataTable';

const listStyle = createStyles({
  root: {
    margin: '0 0',
    listStyleType: 'none',
  },
});

const nestedListStyle = (theme: Theme) =>
  createStyles({
    root: {
      ...listStyle.root,
      paddingLeft: theme.spacing(1),
    },
  });

interface StyleProps extends WithStyles {
  children?: React.ReactNode;
}
// Sub Components
const StyledList = withStyles(
  listStyle,
)(({ classes, children }: StyleProps) => (
  <MetadataList classes={classes}>{children}</MetadataList>
));
const StyledNestedList = withStyles(
  nestedListStyle,
)(({ classes, children }: StyleProps) => (
  <MetadataList classes={classes}>{children}</MetadataList>
));

function renderList(list: Array<any>, nested?: boolean) {
  const values = list.map((item: any, index: number) => (
    <MetadataListItem key={index}>{toValue(item)}</MetadataListItem>
  ));
  return nested ? (
    <StyledNestedList>{values}</StyledNestedList>
  ) : (
    <StyledList>{values}</StyledList>
  );
}

function renderMap(
  map: { [key: string]: any },
  nested?: boolean,
  options?: any,
) {
  const values = Object.keys(map).map(key => {
    const value = toValue(map[key], true);
    const fmtKey =
      options && options.titleFormat
        ? options.titleFormat(key)
        : startCase(key);
    return (
      <MetadataListItem key={key}>
        {`${fmtKey}: `}
        {value}
      </MetadataListItem>
    );
  });

  return nested ? (
    <StyledNestedList>{values}</StyledNestedList>
  ) : (
    <StyledList>{values}</StyledList>
  );
}

function toValue(
  value: ReactElement | object | Array<any> | boolean,
  options?: any,
  nested?: boolean,
) {
  if (React.isValidElement(value)) {
    return <Fragment>{value}</Fragment>;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return renderMap(value, options, nested);
  }

  if (Array.isArray(value)) {
    return renderList(value, nested);
  }

  if (typeof value === 'boolean') {
    return <Fragment>{value ? '✅' : '❌'}</Fragment>;
  }

  return <Fragment>{value}</Fragment>;
}
const ItemValue = ({ value, options }: { value: any; options: any }) => (
  <Fragment>{toValue(value, options)}</Fragment>
);

const TableItem = ({
  title,
  value,
  options,
}: {
  title: string;
  value: any;
  options: any;
}) => {
  return (
    <MetadataTableItem
      title={
        options && options.titleFormat
          ? options.titleFormat(title)
          : startCase(title)
      }
    >
      <ItemValue value={value} options={options} />
    </MetadataTableItem>
  );
};

function mapToItems(info: { [key: string]: string }, options: any) {
  return Object.keys(info).map(key => (
    <TableItem key={key} title={key} value={info[key]} options={options} />
  ));
}

type Props = {
  metadata: { [key: string]: any };
  dense?: boolean;
  options?: any;
};

export const StructuredMetadataTable = ({
  metadata,
  dense = true,
  options,
}: Props) => {
  const metadataItems = mapToItems(metadata, options || {});
  return <MetadataTable dense={dense}>{metadataItems}</MetadataTable>;
};
