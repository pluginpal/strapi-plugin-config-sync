import React, { useState, useEffect } from 'react';
import { Table } from '@buffetjs/core';
import ConfigDiff from '../ConfigDiff';

const headers = [
  {
    name: 'Config name',
    value: 'config_name',
  },
  {
    name: 'Database table',
    value: 'table_name',
  },
  {
    name: 'Change',
    value: 'change_type',
  },
];

const ConfigList = ({ fileConfig, databaseConfig, diff, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [configName, setConfigName] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let formattedRows = [];
    Object.keys(diff).map((config) => {
      // @TODO implement different config types, roles/permissions e.g.
      formattedRows.push({ 
        config_name: config,
        table_name: 'core_store',
        change_type: ''
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
      <Table
        headers={headers}
        onClickRow={(e, data) => {
          setOriginalConfig(fileConfig.get(data.config_name));
          setNewConfig(databaseConfig.get(data.config_name));
          setConfigName(data.config_name);
          setOpenModal(true);
        }}
        rows={!isLoading ? rows : []}
        isLoading={isLoading}
        tableEmptyText="No config changes. You are up to date!"
      />
    </div>
  );
}

export default ConfigList;