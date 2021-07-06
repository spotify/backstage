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

import { createStyles, fade, withStyles } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TreeItem, TreeItemProps, TreeView } from '@material-ui/lab';
import { Schema } from 'jsonschema';
import React, { ReactNode, useMemo, useRef } from 'react';
import { useScrollTargets } from '../ScrollTargetsContext';

const StyledTreeItem = withStyles(theme =>
  createStyles({
    label: {
      userSelect: 'none',
    },
    group: {
      marginLeft: 7,
      paddingLeft: theme.spacing(1),
      borderLeft: `1px solid ${fade(theme.palette.text.primary, 0.15)}`,
    },
  }),
)((props: TreeItemProps) => <TreeItem {...props} />);

export function createSchemaBrowserItems(
  expanded: string[],
  schema: Schema,
  path: string = '',
  depth: number = 0,
): ReactNode {
  let matchArr;
  if (schema.anyOf) {
    matchArr = schema.anyOf;
  } else if (schema.oneOf) {
    matchArr = schema.oneOf;
  } else if (schema.allOf) {
    matchArr = schema.allOf;
  }
  if (matchArr) {
    return matchArr.map((childSchema, index) => {
      const childPath = `${path}/${index + 1}`;
      if (depth > 0) expanded.push(childPath);
      return (
        <StyledTreeItem
          key={childPath}
          nodeId={childPath}
          label={`<Option ${index + 1}>`}
        >
          {createSchemaBrowserItems(
            expanded,
            childSchema,
            childPath,
            depth + 1,
          )}
        </StyledTreeItem>
      );
    });
  }

  switch (schema.type) {
    case 'array': {
      const childPath = `${path}[]`;
      if (depth > 0) expanded.push(childPath);
      return (
        <StyledTreeItem nodeId={childPath} label="[]">
          {schema.items &&
            createSchemaBrowserItems(
              expanded,
              schema.items as Schema,
              childPath,
              depth + 1,
            )}
        </StyledTreeItem>
      );
    }
    case 'object':
    case undefined: {
      const children = [];

      if (schema.properties) {
        children.push(
          ...Object.entries(schema.properties).map(([name, childSchema]) => {
            const childPath = path ? `${path}.${name}` : name;
            if (depth > 0) expanded.push(childPath);
            return (
              <StyledTreeItem key={childPath} nodeId={childPath} label={name}>
                {createSchemaBrowserItems(
                  expanded,
                  childSchema,
                  childPath,
                  depth + 1,
                )}
              </StyledTreeItem>
            );
          }),
        );
      }

      if (schema.patternProperties) {
        children.push(
          ...Object.entries(schema.patternProperties).map(
            ([name, childSchema]) => {
              const childPath = `${path}.<${name}>`;
              if (depth > 0) expanded.push(childPath);
              return (
                <StyledTreeItem
                  key={childPath}
                  nodeId={childPath}
                  label={`<${name}>`}
                >
                  {createSchemaBrowserItems(
                    expanded,
                    childSchema,
                    childPath,
                    depth + 1,
                  )}
                </StyledTreeItem>
              );
            },
          ),
        );
      }

      if (schema.additionalProperties && schema.additionalProperties !== true) {
        const childPath = `${path}.*`;
        if (depth > 0) expanded.push(childPath);
        children.push(
          <StyledTreeItem key={childPath} nodeId={childPath} label="*">
            {createSchemaBrowserItems(
              expanded,
              schema.additionalProperties,
              childPath,
              depth + 1,
            )}
          </StyledTreeItem>,
        );
      }

      return <>{children}</>;
    }

    default:
      return null;
  }
}

export function SchemaBrowser({ schema }: { schema: Schema }) {
  const scroll = useScrollTargets();
  const expandedRef = useRef<string[]>([]);
  const data = useMemo(() => {
    const expanded = new Array<string>();

    const items = createSchemaBrowserItems(expanded, schema);

    return { items, expanded };
  }, [schema]);

  if (!scroll) {
    throw new Error('No scroll handler available');
  }

  const handleToggle = (_event: unknown, expanded: string[]) => {
    expandedRef.current = expanded;
  };

  const handleSelect = (_event: unknown, nodeId: string) => {
    if (expandedRef.current.includes(nodeId)) {
      scroll.scrollTo(nodeId);
    }
  };

  return (
    <TreeView
      defaultExpanded={data.expanded}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {data.items}
    </TreeView>
  );
}
