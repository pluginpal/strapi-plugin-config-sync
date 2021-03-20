import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDiffViewer from 'react-diff-viewer';
import { Map } from 'immutable';

import { getAllDatabaseConfig, getAllFileConfig } from '../../state/actions/Config';

const ConfigPage = () => {
  const dispatch = useDispatch();
  const fileConfig = useSelector((state) => state.getIn(['config', 'fileConfig']), Map());
  const databaseConfig = useSelector((state) => state.getIn(['config', 'databaseConfig']), Map());

  useEffect(() => {
    dispatch(getAllDatabaseConfig());
    dispatch(getAllFileConfig());
  }, []);

  if (!fileConfig || !databaseConfig) {
    return null;
  }

  return (
    <ReactDiffViewer
      oldValue={JSON.stringify(fileConfig.get('plugin_users-permissions_email'), null, 2)}
      newValue={JSON.stringify(databaseConfig.get('plugin_users-permissions_email'), null, 2)}
      splitView={true}
      disableWordDiff
    />
  );
}
 
export default ConfigPage;