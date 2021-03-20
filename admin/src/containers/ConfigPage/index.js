import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';

import { getAllDatabaseConfig, getAllFileConfig } from '../../state/actions/Config';
import ConfigList from '../../components/ConfigList';

const ConfigPage = () => {
  const dispatch = useDispatch();
  const fileConfig = useSelector((state) => state.getIn(['config', 'fileConfig']), Map());
  const databaseConfig = useSelector((state) => state.getIn(['config', 'databaseConfig']), Map());

  useEffect(() => {
    dispatch(getAllDatabaseConfig());
    dispatch(getAllFileConfig());
  }, []);

  if (fileConfig.size === 0 || databaseConfig.size === 0) {
    return null;
  }

  return (
    <div>
      <ConfigList fileConfig={fileConfig} databaseConfig={databaseConfig} />
    </div>
  );
}
 
export default ConfigPage;