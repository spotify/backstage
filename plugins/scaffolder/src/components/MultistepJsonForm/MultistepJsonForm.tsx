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
import { JsonObject } from '@backstage/config';
import { Content, StructuredMetadataTable } from '@backstage/core';
import {
  Box,
  Button,
  Paper,
  Step as StepUI,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import { FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import React, { useState } from 'react';
import { transformSchemaToProps } from './schema';

const Form = withTheme(MuiTheme);
type Step = {
  schema: JsonObject;
  title: string;
} & Partial<Omit<FormProps<any>, 'schema'>>;

type Props = {
  /**
   * Steps for the form, each contains title and form schema
   */
  steps: Step[];
  formData: Record<string, any>;
  onChange: (e: IChangeEvent) => void;
  onReset: () => void;
  onFinish: () => void;
  widgets?: FormProps<any>['widgets'];
  fields?: FormProps<any>['fields'];
};

export const MultistepJsonForm = ({
  steps,
  formData,
  onChange,
  onReset,
  onFinish,
  fields,
  widgets,
}: Props) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleReset = () => {
    setActiveStep(0);
    onReset();
  };
  const handleNext = () =>
    setActiveStep(Math.min(activeStep + 1, steps.length));
  const handleBack = () => setActiveStep(Math.max(activeStep - 1, 0));

  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ title, schema, ...formProps }, index) => {
          return (
            <StepUI key={title}>
              <StepLabel
                aria-label={`Step ${index + 1} ${title}`}
                aria-disabled="false"
                tabIndex={0}
              >
                <Typography variant="h6" component="h3">
                  {title}
                </Typography>
              </StepLabel>
              <StepContent key={title}>
                <Form
                  showErrorList={false}
                  fields={fields}
                  widgets={widgets}
                  noHtml5Validate
                  formData={formData}
                  onChange={onChange}
                  onSubmit={e => {
                    if (e.errors.length === 0) handleNext();
                  }}
                  {...formProps}
                  {...transformSchemaToProps(schema)}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Next step
                  </Button>
                </Form>
              </StepContent>
            </StepUI>
          );
        })}
      </Stepper>
      {activeStep === steps.length && (
        <Content>
          <Paper square elevation={0}>
            <Typography variant="h6">Review and create</Typography>
            <StructuredMetadataTable dense metadata={formData} />
            <Box mb={4} />
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleReset}>Reset</Button>
            <Button variant="contained" color="primary" onClick={onFinish}>
              Create
            </Button>
          </Paper>
        </Content>
      )}
    </>
  );
};
