import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { Table, Thead, Tbody, Tr, Th } from '@strapi/design-system/Table';
import { TableLabel } from '@strapi/design-system/Text';

import ConfigDiff from '../ConfigDiff';
import FirstExport from '../FirstExport';
import NoChanges from '../NoChanges';
import ConfigListRow from './ConfigListRow';

const ConfigList = ({ diff, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [cName, setCname] = useState('');
  const [rows, setRows] = useState([]);

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
    Object.keys(diff.diff).map((name) => {
      const type = name.split('.')[0]; // Grab the first part of the filename.
      const formattedName = name.split(/\.(.+)/)[1]; // Grab the rest of the filename minus the file extension.

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

    setRows(formattedRows);
  }, [diff]);

  const closeModal = () => {
    setOriginalConfig({});
    setNewConfig({});
    setCname('');
    setOpenModal(false);
  };

  if (!isLoading && !isEmpty(diff.message)) {
    return <FirstExport />;
  }

  if (!isLoading && isEmpty(diff.diff)) {
    return <NoChanges />;
  }

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
          {rows.map((row) => (
            <ConfigListRow key={row.configName} row={row} />
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default ConfigList;
