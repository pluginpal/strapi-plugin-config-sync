import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';

import { Table, Thead, Tbody, Tr, Th } from '@strapi/design-system/Table';
import { TableLabel } from '@strapi/design-system/Text';
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import { Loader } from '@strapi/design-system/Loader';

import ConfigDiff from '../ConfigDiff';
import FirstExport from '../FirstExport';
import NoChanges from '../NoChanges';
import ConfigListRow from './ConfigListRow';
import { setConfigPartialDiffInState } from '../../state/actions/Config';

const ConfigList = ({ diff, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [cName, setCname] = useState('');
  const [rows, setRows] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const dispatch = useDispatch();

  const getConfigState = (configName) => {
    if (
      diff.fileConfig[configName]
      && diff.databaseConfig[configName]
    ) {
      return 'Different';
    } else if (
      diff.fileConfig[configName]
      && !diff.databaseConfig[configName]
    ) {
      return 'Only in sync dir';
    } else if (
      !diff.fileConfig[configName]
      && diff.databaseConfig[configName]
    ) {
      return 'Only in DB';
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
          setOpenModal(true);
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

  const closeModal = () => {
    setOriginalConfig({});
    setNewConfig({});
    setCname('');
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Loader>Loading content...</Loader>
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
      <ConfigDiff
        isOpen={openModal}
        oldValue={originalConfig}
        newValue={newConfig}
        onClose={closeModal}
        configName={cName}
      />
      <Table colCount={4} rowCount={rows.length + 1}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                aria-label="Select all entries"
                indeterminate={isIndeterminate}
                onValueChange={(value) => setCheckedItems(checkedItems.map(() => value))}
                value={allChecked}
              />
            </Th>
            <Th>
              <TableLabel>Config name</TableLabel>
            </Th>
            <Th>
              <TableLabel>Config type</TableLabel>
            </Th>
            <Th>
              <TableLabel>State</TableLabel>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <ConfigListRow
              key={row.configName}
              row={row}
              checked={checkedItems[index]}
              updateValue={() => {
                checkedItems[index] = !checkedItems[index];
                setCheckedItems([...checkedItems]);
              }}
            />
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default ConfigList;
