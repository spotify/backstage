/*
 * Copyright 2026 The Backstage Authors
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
  ArrayFieldTemplateItemType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
  ButtonIcon,
  Box,
  Button,
} from '@backstage/ui';
import { Disclosure, DisclosurePanel } from 'react-aria-components';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDeleteBinLine,
  RiAddLine,
  RiArrowRightSLine,
} from '@remixicon/react';

export default function ArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  children,
  disabled,
  hasToolbar,
  hasCopy,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  index,
  onCopyIndexClick,
  onDropIndexClick,
  onReorderClick,
  readonly,
  schema,
}: ArrayFieldTemplateItemType<T, S, F>) {
  const [isOpen, setIsOpen] = useState(true);

  const itemSchema = schema?.items as S | undefined;
  const itemTitle = itemSchema?.title
    ? `${itemSchema.title} ${index + 1}`
    : `Item ${index + 1}`;

  return (
    <Box mb="4">
      <Card>
        <Disclosure isExpanded={isOpen} onExpandedChange={setIsOpen}>
          {({ isExpanded }) => (
            <>
              <CardHeader
                style={{ backgroundColor: 'var(--bui-bg-neutral-2)' }}
              >
                <Box py="3" px="4">
                  <Flex align="center" justify="between">
                    <Flex align="center" gap="2">
                      <Button
                        slot="trigger"
                        style={{
                          padding: '2px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--bui-fg-secondary)',
                        }}
                        aria-label={
                          isExpanded
                            ? `Collapse ${itemTitle}`
                            : `Expand ${itemTitle}`
                        }
                      >
                        {isExpanded ? (
                          <RiArrowDownSLine size={18} />
                        ) : (
                          <RiArrowRightSLine size={18} />
                        )}
                      </Button>
                      <Text variant="body-medium" weight="bold">
                        {itemTitle}
                      </Text>
                    </Flex>
                    {hasToolbar && (
                      <Flex align="center" gap="1">
                        {(hasMoveUp || hasMoveDown) && (
                          <>
                            <ButtonIcon
                              variant="tertiary"
                              size="small"
                              isDisabled={disabled || readonly || !hasMoveUp}
                              onClick={onReorderClick(index, index - 1)}
                              aria-label={`Move up ${itemTitle}`}
                              icon={<RiArrowUpSLine size={18} />}
                            />
                            <ButtonIcon
                              variant="tertiary"
                              size="small"
                              isDisabled={disabled || readonly || !hasMoveDown}
                              onClick={onReorderClick(index, index + 1)}
                              aria-label={`Move down ${itemTitle}`}
                              icon={<RiArrowDownSLine size={18} />}
                            />
                          </>
                        )}
                        {hasCopy && (
                          <ButtonIcon
                            variant="tertiary"
                            size="small"
                            isDisabled={disabled || readonly}
                            onClick={onCopyIndexClick(index)}
                            aria-label={`Duplicate ${itemTitle}`}
                            icon={<RiAddLine size={18} />}
                          />
                        )}
                        {hasRemove && (
                          <ButtonIcon
                            variant="tertiary"
                            size="small"
                            isDisabled={disabled || readonly}
                            onClick={onDropIndexClick(index)}
                            aria-label={`Remove ${itemTitle}`}
                            icon={<RiDeleteBinLine size={18} />}
                          />
                        )}
                      </Flex>
                    )}
                  </Flex>
                </Box>
              </CardHeader>
              <DisclosurePanel>
                <CardBody>
                  <Box p="4">{children}</Box>
                </CardBody>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </Card>
    </Box>
  );
}
