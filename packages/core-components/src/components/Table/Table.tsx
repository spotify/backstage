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

import { BackstageTheme } from '@backstage/theme';
import {
  IconButton,
  makeStyles,
  Typography,
  useTheme,
  withStyles,
} from '@material-ui/core';
// Material-table is not using the standard icons available in in material-ui. https://github.com/mbrn/material-table/issues/51
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { isEqual, transform } from 'lodash';
import MTable, {
  Column,
  Icons,
  MaterialTableProps,
  MTableBody,
  MTableHeader,
  MTableToolbar,
  Options,
} from 'material-table';
import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CheckboxTreeProps } from '../CheckboxTree/CheckboxTree';
import { SelectProps } from '../Select/Select';
import { Filter, Filters, SelectedFilters, Without } from './Filters';

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

// TODO: Material table might already have such a function internally that we can use?
function extractValueByField(data: any, field: string): any | undefined {
  const path = field.split('.');
  let value = data[path[0]];

  for (let i = 1; i < path.length; ++i) {
    if (value === undefined) {
      return value;
    }

    const f = path[i];
    value = value[f];
  }

  return value;
}

const StyledMTableHeader = withStyles(theme => ({
  header: {
    padding: theme.spacing(1, 2, 1, 2.5),
    borderTop: `1px solid ${theme.palette.grey.A100}`,
    borderBottom: `1px solid ${theme.palette.grey.A100}`,
    // withStyles hasn't a generic overload for theme
    color: (theme as BackstageTheme).palette.textSubtle,
    fontWeight: theme.typography.fontWeightBold,
    position: 'static',
    wordBreak: 'normal',
  },
}))(MTableHeader);

const StyledMTableToolbar = withStyles(theme => ({
  root: {
    padding: theme.spacing(3, 0, 2.5, 2.5),
  },
  title: {
    '& > h6': {
      fontWeight: 'bold',
    },
  },
  searchField: {
    paddingRight: theme.spacing(2),
  },
}))(MTableToolbar);

const useFilterStyles = makeStyles<BackstageTheme>(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    whiteSpace: 'nowrap',
  },
}));

const useTableStyles = makeStyles<BackstageTheme>(() => ({
  root: {
    display: 'flex',
    alignItems: 'start',
  },
}));

function convertColumns<T extends object>(
  columns: TableColumn<T>[],
  theme: BackstageTheme,
): TableColumn<T>[] {
  return columns.map(column => {
    const headerStyle: React.CSSProperties = {};
    const cellStyle: React.CSSProperties =
      typeof column.cellStyle === 'object' ? column.cellStyle : {};

    if (column.highlight) {
      headerStyle.color = theme.palette.textContrast;
      cellStyle.fontWeight = theme.typography.fontWeightBold;
    }

    return {
      ...column,
      headerStyle,
      cellStyle,
    };
  });
}

function removeDefaultValues(state: any, defaultState: any): any {
  return transform(state, (result, value, key) => {
    if (!isEqual(value, defaultState[key])) {
      result[key] = value;
    }
  });
}

const defaultInitialState = {
  search: '',
  filtersOpen: false,
  filters: {},
};

export interface TableColumn<T extends object = {}> extends Column<T> {
  highlight?: boolean;
  width?: string;
}

export type TableFilter = {
  column: string;
  type: 'select' | 'multiple-select' | 'checkbox-tree';
};

export type TableState = {
  search?: string;
  filtersOpen?: boolean;
  filters?: SelectedFilters;
};

export interface TableProps<T extends object = {}>
  extends MaterialTableProps<T> {
  columns: TableColumn<T>[];
  subtitle?: string;
  filters?: TableFilter[];
  initialState?: TableState;
  emptyContent?: ReactNode;
  onStateChange?: (state: TableState) => any;
}

export function TableToolbar(toolbarProps: {
  toolbarRef: MutableRefObject<any>;
  setSearch: (value: string) => void;
  onSearchChanged: (value: string) => void;
  toggleFilters: () => void;
  hasFilters: boolean;
  selectedFiltersLength: number;
}) {
  const {
    toolbarRef,
    setSearch,
    hasFilters,
    selectedFiltersLength,
    toggleFilters,
  } = toolbarProps;
  const filtersClasses = useFilterStyles();
  const onSearchChanged = useCallback(
    (searchText: string) => {
      toolbarProps.onSearchChanged(searchText);
      setSearch(searchText);
    },
    [toolbarProps, setSearch],
  );

  if (hasFilters) {
    return (
      <div className={filtersClasses.root}>
        <div className={filtersClasses.root}>
          <IconButton onClick={toggleFilters} aria-label="filter list">
            <FilterList />
          </IconButton>
          <Typography className={filtersClasses.title}>
            Filters ({selectedFiltersLength})
          </Typography>
        </div>
        <StyledMTableToolbar
          {...toolbarProps}
          ref={toolbarRef}
          onSearchChanged={onSearchChanged}
        />
      </div>
    );
  }

  return (
    <StyledMTableToolbar
      {...toolbarProps}
      ref={toolbarRef}
      onSearchChanged={onSearchChanged}
    />
  );
}

export function Table<T extends object = {}>({
  columns,
  options,
  title,
  subtitle,
  filters,
  initialState,
  emptyContent,
  onStateChange,
  ...props
}: TableProps<T>) {
  const tableClasses = useTableStyles();

  const { data, ...propsWithoutData } = props;

  const theme = useTheme<BackstageTheme>();

  const calculatedInitialState = { ...defaultInitialState, ...initialState };

  const [filtersOpen, setFiltersOpen] = useState(
    calculatedInitialState.filtersOpen,
  );
  const toggleFilters = useCallback(() => setFiltersOpen(v => !v), [
    setFiltersOpen,
  ]);
  const [selectedFiltersLength, setSelectedFiltersLength] = useState(0);
  const [tableData, setTableData] = useState(data as any[]);
  const [selectedFilters, setSelectedFilters] = useState(
    calculatedInitialState.filters,
  );

  const MTColumns = convertColumns(columns, theme);

  const [search, setSearch] = useState(calculatedInitialState.search);
  const toolbarRef = useRef<any>();

  useEffect(() => {
    if (toolbarRef.current) {
      toolbarRef.current.onSearchChange(search);
    }
  }, [search, toolbarRef]);

  useEffect(() => {
    if (onStateChange) {
      const state = removeDefaultValues(
        {
          search,
          filtersOpen,
          filters: selectedFilters,
        },
        defaultInitialState,
      );

      onStateChange(state);
    }
  }, [search, filtersOpen, selectedFilters, onStateChange]);

  const defaultOptions: Options<T> = {
    headerStyle: {
      textTransform: 'uppercase',
    },
  };

  const getFieldByTitle = useCallback(
    (titleValue: string | keyof T) =>
      columns.find(el => el.title === titleValue)?.field,
    [columns],
  );

  useEffect(() => {
    if (typeof data === 'function') {
      return;
    }
    if (!selectedFilters) {
      setTableData(data as any[]);
      return;
    }

    const selectedFiltersArray = Object.values(selectedFilters);
    if (data && selectedFiltersArray.flat().length) {
      const newData = (data as any[]).filter(
        el =>
          !!Object.entries(selectedFilters)
            .filter(([, value]) => !!value.length)
            .every(([key, filterValue]) => {
              const fieldValue = extractValueByField(
                el,
                getFieldByTitle(key) as string,
              );

              if (Array.isArray(fieldValue) && Array.isArray(filterValue)) {
                return fieldValue.some(v => filterValue.includes(v));
              } else if (Array.isArray(fieldValue)) {
                return fieldValue.includes(filterValue);
              } else if (Array.isArray(filterValue)) {
                return filterValue.includes(fieldValue);
              }

              return fieldValue === filterValue;
            }),
      );
      setTableData(newData);
    } else {
      setTableData(data as any[]);
    }
    setSelectedFiltersLength(selectedFiltersArray.flat().length);
  }, [data, selectedFilters, getFieldByTitle]);

  const constructFilters = (
    filterConfig: TableFilter[],
    dataValue: any[] | undefined,
  ): Filter[] => {
    const extractDistinctValues = (field: string | keyof T): Set<any> => {
      const distinctValues = new Set<any>();
      const addValue = (value: any) => {
        if (value !== undefined && value !== null) {
          distinctValues.add(value);
        }
      };

      if (dataValue) {
        dataValue.forEach(el => {
          const value = extractValueByField(
            el,
            getFieldByTitle(field) as string,
          );

          if (Array.isArray(value)) {
            (value as []).forEach(addValue);
          } else {
            addValue(value);
          }
        });
      }

      return distinctValues;
    };

    const constructCheckboxTree = (
      filter: TableFilter,
    ): Without<CheckboxTreeProps, 'onChange'> => ({
      label: filter.column,
      subCategories: [...extractDistinctValues(filter.column)].map(v => ({
        label: v,
        options: [],
      })),
    });

    const constructSelect = (
      filter: TableFilter,
    ): Without<SelectProps, 'onChange'> => {
      return {
        placeholder: 'All results',
        label: filter.column,
        multiple: filter.type === 'multiple-select',
        items: [...extractDistinctValues(filter.column)].sort().map(value => ({
          label: value,
          value,
        })),
      };
    };

    return filterConfig.map(filter => ({
      type: filter.type,
      element:
        filter.type === 'checkbox-tree'
          ? constructCheckboxTree(filter)
          : constructSelect(filter),
    }));
  };

  const hasFilters = !!filters?.length;
  const Toolbar = useCallback(
    toolbarProps => {
      return (
        <TableToolbar
          toolbarRef={toolbarRef}
          setSearch={setSearch}
          hasFilters={hasFilters}
          selectedFiltersLength={selectedFiltersLength}
          toggleFilters={toggleFilters}
          {...toolbarProps}
        />
      );
    },
    [toggleFilters, hasFilters, selectedFiltersLength, setSearch, toolbarRef],
  );

  const hasNoRows = typeof data !== 'function' && data.length === 0;
  const columnCount = columns.length;
  const Body = useCallback(
    bodyProps => {
      if (emptyContent && hasNoRows) {
        return (
          <tbody>
            <tr>
              <td colSpan={columnCount}>{emptyContent}</td>
            </tr>
          </tbody>
        );
      }

      return <MTableBody {...bodyProps} />;
    },
    [hasNoRows, emptyContent, columnCount],
  );

  return (
    <div className={tableClasses.root}>
      {filtersOpen && data && typeof data !== 'function' && filters?.length && (
        <Filters
          filters={constructFilters(filters, data as any[])}
          selectedFilters={selectedFilters}
          onChangeFilters={setSelectedFilters}
        />
      )}
      <MTable<T>
        components={{
          Header: StyledMTableHeader,
          Toolbar,
          Body,
        }}
        options={{ ...defaultOptions, ...options }}
        columns={MTColumns}
        icons={tableIcons}
        title={
          <>
            <Typography variant="h5">{title}</Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body1">
                {subtitle}
              </Typography>
            )}
          </>
        }
        data={typeof data === 'function' ? data : tableData}
        style={{ width: '100%' }}
        {...propsWithoutData}
      />
    </div>
  );
}
