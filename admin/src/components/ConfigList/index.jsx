import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Typography,
  Checkbox,
  Loader,
  Flex,
  Box,
  TextInput,
  IconButton,
} from '@strapi/design-system';
import { CaretDown, CaretUp, Search, Cross } from '@strapi/icons';

import ConfigDiff from '../ConfigDiff';
import FirstExport from '../FirstExport';
import NoChanges from '../NoChanges';
import ConfigListRow from './ConfigListRow';
import { setConfigPartialDiffInState } from '../../state/actions/Config';

const SearchBox = styled(Box)`
  width: 100%;

  @media (min-width: 768px) {
    width: 40%;
  }
`;

const ConfigList = ({ diff, isLoading }) => {
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [cName, setCname] = useState('');
  const [rows, setRows] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [sortBy, setSortBy] = useState('configName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getConfigState = (configName) => {
    if (
      diff.fileConfig[configName]
      && diff.databaseConfig[configName]
    ) {
      return formatMessage({ id: 'config-sync.ConfigList.Different' });
    } else if (
      diff.fileConfig[configName]
      && !diff.databaseConfig[configName]
    ) {
      return formatMessage({ id: 'config-sync.ConfigList.OnlyDir' });
    } else if (
      !diff.fileConfig[configName]
      && diff.databaseConfig[configName]
    ) {
      return formatMessage({ id: 'config-sync.ConfigList.OnlyDB' });
    }
  };

  useEffect(() => {
    if (isEmpty(diff.diff)) {
      setRows([]);
      return;
    }

    const formattedRows = [];
    const newCheckedItems = [];
    Object.keys(diff.diff).map((name) => {
      const type = name.split('.')[0]; // Grab the first part of the filename.
      const formattedName = name.split(/\.(.+)/)[1]; // Grab the rest of the filename minus the file extension.

      newCheckedItems.push(true);

      formattedRows.push({
        configName: formattedName,
        configType: type,
        state: getConfigState(name),
        onClick: (configType, configName) => {
          setOriginalConfig(diff.fileConfig[`${configType}.${configName}`]);
          setNewConfig(diff.databaseConfig[`${configType}.${configName}`]);
          setCname(`${configType}.${configName}`);
        },
      });
    });
    setCheckedItems(newCheckedItems);

    setRows(formattedRows);
  }, [diff]);

  useEffect(() => {
    const newPartialDiff = [];
    checkedItems.map((item, index) => {
      if (item && rows[index]) newPartialDiff.push(`${rows[index].configType}.${rows[index].configName}`);
    });
    dispatch(setConfigPartialDiffInState(newPartialDiff));
  }, [checkedItems]);

  const sortedRows = useMemo(() => {
    const rowsWithIndex = rows.map((row, originalIndex) => ({ ...row, originalIndex }));

    const filteredRows = searchQuery
      ? rowsWithIndex.filter((row) => (
        `${row.configType}.${row.configName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ))
      : rowsWithIndex;

    return filteredRows.sort((a, b) => {
      const aValue = (a[sortBy] || '').toLowerCase();
      const bValue = (b[sortBy] || '').toLowerCase();

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortBy, sortOrder, searchQuery]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Loader>{formatMessage({ id: 'config-sync.ConfigList.Loading' })}</Loader>
      </div>
    );
  }

  if (!isLoading && !isEmpty(diff.message)) {
    return <FirstExport />;
  }

  if (!isLoading && isEmpty(diff.diff)) {
    return <NoChanges />;
  }

  const allChecked = checkedItems && checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <CaretUp /> : <CaretDown />;
  };

  return (
    <div>
      <SearchBox paddingBottom={4}>
        <TextInput
          startAction={<Search />}
          endAction={searchQuery ? (
            <IconButton
              label={formatMessage({ id: 'config-sync.ConfigList.ClearSearch' })}
              onClick={() => setSearchQuery('')}
              variant="ghost"
            >
              <Cross />
            </IconButton>
          ) : null}
          aria-label={formatMessage({ id: 'config-sync.ConfigList.Search' })}
          placeholder={formatMessage({ id: 'config-sync.ConfigList.Search' })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBox>
      <Table colCount={4} rowCount={sortedRows.length + 1}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                aria-label={formatMessage({ id: 'config-sync.ConfigList.SelectAll' })}
                checked={isIndeterminate ? "indeterminate" : allChecked}
                onCheckedChange={(value) => setCheckedItems(checkedItems.map(() => value))}
              />
            </Th>
            <Th onClick={() => handleSort('configName')} style={{ cursor: 'pointer' }}>
              <Flex gap={1}>
                <Typography variant="sigma">{formatMessage({ id: 'config-sync.ConfigList.ConfigName' })}</Typography>
                {renderSortIcon('configName')}
              </Flex>
            </Th>
            <Th onClick={() => handleSort('configType')} style={{ cursor: 'pointer' }}>
              <Flex gap={1}>
                <Typography variant="sigma">{formatMessage({ id: 'config-sync.ConfigList.ConfigType' })}</Typography>
                {renderSortIcon('configType')}
              </Flex>
            </Th>
            <Th onClick={() => handleSort('state')} style={{ cursor: 'pointer' }}>
              <Flex gap={1}>
                <Typography variant="sigma">{formatMessage({ id: 'config-sync.ConfigList.State' })}</Typography>
                {renderSortIcon('state')}
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedRows.map((row) => (
            <ConfigDiff
              key={row.configName}
              oldValue={originalConfig}
              newValue={newConfig}
              configName={cName}
              trigger={(
                <ConfigListRow
                  row={row}
                  checked={checkedItems[row.originalIndex]}
                  updateValue={() => {
                    checkedItems[row.originalIndex] = !checkedItems[row.originalIndex];
                    setCheckedItems([...checkedItems]);
                  }}
                />
              )}
            />
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default ConfigList;
