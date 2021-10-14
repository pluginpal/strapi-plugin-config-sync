import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import { NoContent } from '@strapi/helper-plugin';
import AddIcon from '@strapi/icons/AddIcon';
import { VisuallyHidden } from '@strapi/parts/VisuallyHidden';
import { Table, Thead, Tbody, Tr, Th, TFooter } from '@strapi/parts/Table';
import { TableLabel } from '@strapi/parts/Text';
import { Button } from '@strapi/parts/Button';

import ConfigDiff from '../ConfigDiff';
import FirstExport from '../FirstExport';
import ConfigListRow from './ConfigListRow';

const ConfigList = ({ diff, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [configName, setConfigName] = useState('');
  const [rows, setRows] = useState([]);

  const getConfigState = (configName) => {
    if (
      diff.fileConfig[configName] &&
      diff.databaseConfig[configName]
    ) {
      return 'Different'
    } else if (
      diff.fileConfig[configName] &&
      !diff.databaseConfig[configName]
    ) {
      return 'Only in sync dir'
    } else if (
      !diff.fileConfig[configName] &&
      diff.databaseConfig[configName]
    ) {
      return 'Only in DB'
    }
  };

  useEffect(() => {
    if (isEmpty(diff.diff)) {
      setRows([]);
      return;
    }

    let formattedRows = [];
    Object.keys(diff.diff).map((configName) => {
      const type = configName.split('.')[0]; // Grab the first part of the filename.
      const name = configName.split(/\.(.+)/)[1]; // Grab the rest of the filename minus the file extension.

      formattedRows.push({
        config_name: name,
        config_type: type,
        state: getConfigState(configName),
        onClick: (config_type, config_name) => {
          setOriginalConfig(diff.fileConfig[`${config_type}.${config_name}`]);
          setNewConfig(diff.databaseConfig[`${config_type}.${config_name}`]);
          setConfigName(`${config_type}.${config_name}`);
          setOpenModal(true);
        }
      });
    });

    setRows(formattedRows);
  }, [diff]);

  const closeModal = () => {
    setOriginalConfig({});
    setNewConfig({});
    setConfigName('');
    setOpenModal(false);
  };

  if (!isLoading && !isEmpty(diff.message)) {
    return <FirstExport />;
  }

  return (
    <div>
      <ConfigDiff
        isOpen={openModal}
        oldValue={originalConfig}
        newValue={newConfig}
        onClose={closeModal}
        onToggle={closeModal}
        configName={configName}
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
            <ConfigListRow key={row.name} {...row} />
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default ConfigList;
