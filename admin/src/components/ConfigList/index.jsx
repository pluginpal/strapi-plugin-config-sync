import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Typography,
  Checkbox,
  Loader,
} from '@strapi/design-system';

import ConfigDiff from '../ConfigDiff';
import FirstExport from '../FirstExport';
import NoChanges from '../NoChanges';
import ConfigListRow from './ConfigListRow';
import { setConfigPartialDiffInState } from '../../state/actions/Config';


const ConfigList = ({ diff, isLoading }) => {
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [cName, setCname] = useState('');
  const [rows, setRows] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

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

  return (
    <div>
      <Table colCount={4} rowCount={rows.length + 1}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                aria-label={formatMessage({ id: 'config-sync.ConfigList.SelectAll' })}
                checked={isIndeterminate ? "indeterminate" : allChecked}
                onCheckedChange={(value) => setCheckedItems(checkedItems.map(() => value))}
              />
            </Th>
            <Th>
              <Typography variant="sigma">{formatMessage({ id: 'config-sync.ConfigList.ConfigName' })}</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">{formatMessage({ id: 'config-sync.ConfigList.ConfigType' })}</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">{formatMessage({ id: 'config-sync.ConfigList.State' })}</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <ConfigDiff
              key={row.configName}
              oldValue={originalConfig}
              newValue={newConfig}
              configName={cName}
              trigger={(
                <ConfigListRow
                  row={row}
                  checked={checkedItems[index]}
                  updateValue={() => {
                    checkedItems[index] = !checkedItems[index];
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
