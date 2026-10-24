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
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { Select } from '@backstage/ui';
import overrides from './selectOverrides.module.css';

export default function SelectWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  options,
  required,
  disabled,
  readonly,
  value,
  multiple,
  label,
  schema,
  onChange: onFieldChange,
  onBlur: onFieldBlur,
  onFocus: onFieldFocus,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const { enumOptions, emptyValue } = options;

  const handleSingleChange = (newValue: string) => {
    const actualIndex = newValue === '' ? '' : newValue;
    onFieldChange(
      enumOptionsValueForIndex<S>(actualIndex, enumOptions, emptyValue),
    );
  };

  const handleMultiChange = (selected: string[]) => {
    const selectedValues = enumOptionsValueForIndex<S>(
      selected,
      enumOptions,
      emptyValue,
    );
    onFieldChange(selectedValues as unknown as T);
  };

  const handleBlur = () => {
    onFieldBlur(id, value);
  };

  const handleFocus = () => {
    onFieldFocus(id, value);
  };

  const hasError = rawErrors.length > 0;

  const selectOptions =
    enumOptions?.map(({ label: optionLabel }, index) => ({
      value: String(index),
      label: optionLabel,
    })) || [];

  if (!multiple && schema.default === undefined) {
    selectOptions.unshift({
      value: '',
      label: (options.placeholder as string) || 'Select an option',
    });
  }

  if (multiple) {
    const selectedIndices = enumOptionsIndexForValue<S>(
      value,
      enumOptions,
      true,
    );
    const normalizedIndices = Array.isArray(selectedIndices)
      ? selectedIndices.map(String)
      : [];

    return (
      <Select
        className={overrides.select}
        id={id}
        name={id}
        label={label || schema.title}
        secondaryLabel={required ? 'Required' : undefined}
        options={selectOptions}
        selectionMode="multiple"
        value={normalizedIndices}
        onChange={selected => {
          handleMultiChange((selected ?? []) as string[]);
        }}
        isRequired={required}
        isDisabled={disabled || readonly}
        isInvalid={hasError}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-describedby={ariaDescribedByIds<T>(id)}
      />
    );
  }

  const selectedIndex = enumOptionsIndexForValue<S>(value, enumOptions);

  return (
    <Select
      className={overrides.select}
      id={id}
      name={id}
      label={label || schema.title}
      secondaryLabel={required ? 'Required' : undefined}
      options={selectOptions}
      selectedKey={selectedIndex !== undefined ? String(selectedIndex) : ''}
      onSelectionChange={key => {
        const selected = key ? String(key) : '';
        handleSingleChange(selected);
      }}
      isRequired={required}
      isDisabled={disabled || readonly}
      isInvalid={hasError}
      onBlur={handleBlur}
      onFocus={handleFocus}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
}
