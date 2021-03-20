import React, { useState } from 'react';
import { Table } from '@buffetjs/core';
import difference from '../../helpers/getObjectDiff';
import ConfigDiff from '../ConfigDiff';

const headers = [
  {
    name: 'Id',
    value: 'id',
  },
  {
    name: 'Config name',
    value: 'name',
  },
  {
    name: 'Database table',
    value: 'lastname',
  },
  {
    name: 'Change',
    value: 'change_type',
  },
];

const ConfigList = ({ fileConfig, databaseConfig }) => {
  const diff = difference(fileConfig.toJS(), databaseConfig.toJS());
  const [openModal, setOpenModal] = useState(false);
  const [originalConfig, setOriginalConfig] = useState({});
  const [newConfig, setNewConfig] = useState({});
  const [configName, setConfigName] = useState('');
  let rows = [];

  Object.keys(diff).map((config) => rows.push({ name: config }));

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
          setOriginalConfig(fileConfig.get(data.name));
          setNewConfig(databaseConfig.get(data.name));
          setConfigName(data.name);
          setOpenModal(true);
        }}
        rows={rows} 
      />
    </div>
  );
}

export default ConfigList;