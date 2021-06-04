/*
 * Copyright 2021 Spotify AB
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
import { SearchResults } from '../../apis';
import { Button, makeStyles } from '@material-ui/core';
import ExportIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(() => ({
  exportIcon: {
    fontSize: '19px',
  },
  exportMenu: {
    position: 'absolute',
    top: '25px',
    right: '25px',
    zIndex: 1,
  },
}));

const addHeadersRow = (headers: string[], objArray: any[]) => {
  const headersRow: any = {};
  headers.map(key => (headersRow[key] = key.toUpperCase()));
  objArray.splice(0, 0, headersRow);
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  return array;
};

const toCSV = (objArray: any[], headers: string[]) => {
  const arrayWithHeaders = addHeadersRow(headers, objArray);
  let str = '';
  for (let i = 0; i < arrayWithHeaders.length; i++) {
    let line = '';
    for (const key in arrayWithHeaders[i]) {
      if (arrayWithHeaders[i].hasOwnProperty(key)) {
        if (line !== '') line += ',';
        line += arrayWithHeaders[i][key];
      }
    }
    str += `${line}\r\n`;
  }

  return str;
};

const downloadCSV = (reportTitle: string, values: string) => {
  const fileName = reportTitle.replace(/ /g, '_');
  const uri = `data:text/csv;charset=utf-8,${escape(values)}`;
  const link = document.createElement('a');

  link.href = uri;
  link.style.visibility = 'hidden';
  link.download = `${fileName}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const convertor = (JSONData: SearchResults, headers: Array<string>) => {
  if (!JSONData?.length) {
    return;
  }

  const filterByHeaders = (results: any) =>
    results.map((result: any) => {
      const obj: any = {};
      headers.map(key => (obj[key] = result[key]));
      return obj;
    });

  const values = toCSV(filterByHeaders(JSONData), headers);
  const reportTitle = `csv_globalSearch_${new Date().getTime()}`;
  downloadCSV(reportTitle, values);
};

interface SearchExportProps {
  results: SearchResults;
  headers: Array<string>;
}

export const SearchExport = ({ results, headers }: SearchExportProps) => {
  const classes = useStyles();

  const handleExportClick = () => {
    convertor(results, headers);
  };

  return (
    <div className={classes.exportMenu}>
      <Button
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={() => handleExportClick()}
      >
        <ExportIcon className={classes.exportIcon} /> Export
      </Button>
    </div>
  );
};
