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

import {
  Checkbox,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { AnalyzeResult } from '../../api';
import { BackButton, NextButton } from '../Buttons';
import { EntityListComponent } from '../EntityListComponent';
import { PrepareResult } from '../useImportState';

type Props = {
  analyzeResult: Extract<AnalyzeResult, { type: 'locations' }>;
  prepareResult?: PrepareResult;
  onPrepare: (result: PrepareResult) => void;
  onGoBack?: () => void;
};

/**
 * A form that lets a user select one of a list of locations to import
 *
 * @param analyzeResult the result of the analysis
 * @param prepareResult the selectected locations from a previous step
 * @param onPrepare called after the selection
 * @param onGoBack called to go back to the previous step
 */
export const StepPrepareSelectLocations = ({
  analyzeResult,
  prepareResult,
  onPrepare,
  onGoBack,
}: Props) => {
  const [selectedUrls, setSelectedUrls] = useState<string[]>(
    prepareResult?.locations.map(l => l.target) || [],
  );

  const handleResult = useCallback(async () => {
    onPrepare({
      type: 'locations',
      locations: analyzeResult.locations.filter((l: any) =>
        selectedUrls.includes(l.target),
      ),
    });
  }, [analyzeResult.locations, onPrepare, selectedUrls]);

  const onItemClick = (url: string) => {
    setSelectedUrls(urls =>
      urls.includes(url) ? urls.filter(u => u !== url) : urls.concat(url),
    );
  };

  const onSelectAll = () => {
    setSelectedUrls(urls =>
      urls.length < analyzeResult.locations.length
        ? analyzeResult.locations.map(l => l.target)
        : [],
    );
  };

  return (
    <>
      <Typography>
        Select one or more locations that are present in your git repository:
      </Typography>

      <EntityListComponent
        firstListItem={
          <ListItem dense button onClick={onSelectAll}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selectedUrls.length === analyzeResult.locations.length}
                indeterminate={
                  selectedUrls.length > 0 &&
                  selectedUrls.length < analyzeResult.locations.length
                }
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary="Select All" />
          </ListItem>
        }
        onItemClick={onItemClick}
        locations={analyzeResult.locations}
        locationListItemIcon={target => (
          <Checkbox
            edge="start"
            checked={selectedUrls.includes(target)}
            tabIndex={-1}
            disableRipple
          />
        )}
        collapsed
      />

      <Grid container spacing={0}>
        {onGoBack && <BackButton onClick={onGoBack} />}
        <NextButton disabled={selectedUrls.length === 0} onClick={handleResult}>
          Review
        </NextButton>
      </Grid>
    </>
  );
};
