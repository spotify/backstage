/*
 * Copyright 2022 The Backstage Authors
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

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import { useDryRun } from '../DryRunContext';
import { downloadBlob } from '../../../../lib/download';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../../translation';

const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'auto',
    background: theme.palette.background.default,
  },
  iconSuccess: {
    minWidth: 0,
    marginRight: theme.spacing(1),
    color: theme.palette.status.ok,
  },
  iconFailure: {
    minWidth: 0,
    marginRight: theme.spacing(1),
    color: theme.palette.status.error,
  },
}));

export function DryRunResultsList() {
  const classes = useStyles();
  const dryRun = useDryRun();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <List className={classes.root} dense>
      {dryRun.results.map(result => {
        const failed = result.log.some(l => l.body.status === 'failed');
        let isLoading = false;

        async function downloadResult() {
          isLoading = true;
          await downloadDirectoryContents(
            result.directoryContents,
            `dry-run-result-${result.id}.zip`,
          );
          isLoading = false;
        }

        return (
          <ListItem
            button
            key={result.id}
            selected={dryRun.selectedResult?.id === result.id}
            onClick={() => dryRun.selectResult(result.id)}
          >
            <ListItemIcon
              className={failed ? classes.iconFailure : classes.iconSuccess}
            >
              {failed ? <CancelIcon /> : <CheckIcon />}
            </ListItemIcon>
            <ListItemText
              primary={t('templateEditorPage.dryRunResultsList.title', {
                resultId: `${result.id}`,
              })}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="download"
                title={t(
                  'templateEditorPage.dryRunResultsList.downloadButtonTitle',
                )}
                disabled={isLoading}
                onClick={() => downloadResult()}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                title={t(
                  'templateEditorPage.dryRunResultsList.deleteButtonTitle',
                )}
                onClick={() => dryRun.deleteResult(result.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

async function downloadDirectoryContents(
  directoryContents: {
    path: string;
    base64Content: string;
    executable?: boolean;
  }[],
  name: string,
) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  for (const d of directoryContents) {
    // Hand the base64 straight to JSZip, which decodes it to bytes itself.
    // Decoding with atob first yields a binary string, which JSZip then
    // re-encodes as UTF-8, doubling every byte above 0x7F.
    zip.file(d.path, d.base64Content, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, name);
}
