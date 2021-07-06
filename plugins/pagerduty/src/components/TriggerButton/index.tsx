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
import React, { useCallback, PropsWithChildren, useState } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

import { usePagerdutyEntity } from '../../hooks';
import { TriggerDialog } from '../TriggerDialog';

export type TriggerButtonProps = {};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  buttonStyle: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

export function TriggerButton({
  children,
}: PropsWithChildren<TriggerButtonProps>) {
  const { buttonStyle } = useStyles();
  const { integrationKey } = usePagerdutyEntity();
  const [dialogShown, setDialogShown] = useState<boolean>(false);

  const showDialog = useCallback(() => {
    setDialogShown(true);
  }, [setDialogShown]);
  const hideDialog = useCallback(() => {
    setDialogShown(false);
  }, [setDialogShown]);

  const disabled = !integrationKey;
  return (
    <>
      <Button
        onClick={showDialog}
        variant="contained"
        className={disabled ? '' : buttonStyle}
        disabled={disabled}
      >
        {integrationKey
          ? children ?? 'Create Incident'
          : 'Missing integration key'}
      </Button>
      {integrationKey && (
        <TriggerDialog showDialog={dialogShown} handleDialog={hideDialog} />
      )}
    </>
  );
}
