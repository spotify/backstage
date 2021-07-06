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

import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { AlertInstructionsLayout } from '../AlertInstructionsLayout';
import { CodeSnippet, Link } from '@backstage/core-components';

export const LabelDataflowInstructionsPage = () => {
  return (
    <AlertInstructionsLayout title="Investigating Growth">
      <Typography variant="h1">Labeling Dataflow Jobs</Typography>
      <Typography paragraph>
        Labels in Google Cloud Platform are key-value pairs that can be added to
        most types of cloud resources. Since these labels are also exported in
        billing data, adding labels allows a granular breakdown of cloud cost by
        software entity.
      </Typography>
      <Typography paragraph>
        In Cloud Dataflow, labels can be added to a job either programmatically
        or via the command-line when launching a job. Note that GCP has{' '}
        <Link to="https://cloud.google.com/compute/docs/labeling-resources#restrictions">
          restrictions
        </Link>{' '}
        on the length and characters that can be used in labels.
      </Typography>
      <Typography paragraph>
        Labels are not retroactive, so cost tracking is only possible from when
        the labels are first added to a Dataflow job.
      </Typography>

      <Box mt={4}>
        <Typography variant="h3">DataflowPipelineOptions</Typography>
        <Typography paragraph>
          Dataflow jobs using Beam's{' '}
          <Link to="https://beam.apache.org/releases/javadoc/2.3.0/org/apache/beam/runners/dataflow/options/DataflowPipelineOptions.html">
            DataflowPipelineOptions
          </Link>{' '}
          directly can use the <b>setLabels</b> function to add one or more
          labels:
          <CodeSnippet
            language="java"
            text={`private DataflowPipelineOptions options = PipelineOptionsFactory.fromArgs(args).as(DataflowPipelineOptionsImpl.class); 
options.setLabels(ImmutableMap.of("job-id", "my-dataflow-job"));`}
          />
        </Typography>
        <Typography paragraph>
          Dataflow jobs using Scio can similarly set options on the ScioContext:
          <CodeSnippet
            language="scala"
            text={`val (sc: ScioContext, args: Args) = ContextAndArgs(cmdLineArgs)
sc.optionsAs[DataflowPipelineOptions].setLabels(Map("job-id" -> "my-dataflow-job").asJava)`}
          />
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h3">Command-line</Typography>
        <Typography paragraph>
          Dataflow jobs launched from the command-line can add labels as an
          argument:
          <CodeSnippet
            language="shell"
            text={`--labels={"job-id": "my-dataflow-job", "date-argument": "2020-09-16"}`}
          />
        </Typography>
        <Typography paragraph>
          For more information on specifying options, see the{' '}
          <Link to="https://cloud.google.com/dataflow/docs/guides/specifying-exec-params">
            Dataflow documentation
          </Link>{' '}
          or{' '}
          <Link to="https://spotify.github.io/scio/api/com/spotify/scio/ScioContext.html">
            Scio Scaladoc
          </Link>
          .
        </Typography>
      </Box>
    </AlertInstructionsLayout>
  );
};
