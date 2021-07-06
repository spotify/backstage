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
import { repoPickerValidation } from './validation';
import { FieldValidation } from '@rjsf/core';

describe('RepoPicker Validation', () => {
  const fieldValidator = () =>
    (({
      addError: jest.fn(),
    } as unknown) as FieldValidation);

  it('validaties when no repo', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('github.com?owner=a', mockFieldValidation);

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided',
    );
  });

  it('validates when no owner', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('github.com?repo=a', mockFieldValidation);

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided',
    );
  });

  it('validates when not a real url', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('', mockFieldValidation);

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Unable to parse the Repository URL',
    );
  });

  it('validates properly with proper input', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('github.com?owner=a&repo=b', mockFieldValidation);

    expect(mockFieldValidation.addError).not.toHaveBeenCalled();
  });
});
