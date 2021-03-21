import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';

import { getAllConfig } from '../../state/actions/Config';
import ConfigList from '../../components/ConfigList';
import ActionButtons from '../../components/ActionButtons';
import difference from '../../helpers/getObjectDiff';

const ConfigPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.getIn(['config', 'isLoading']), Map());
  const fileConfig = useSelector((state) => state.getIn(['config', 'fileConfig']), Map());
  const databaseConfig = useSelector((state) => state.getIn(['config', 'databaseConfig']), Map());

  useEffect(() => {
    dispatch(getAllConfig());
  }, []);

  const diff = difference(fileConfig.toJS(), databaseConfig.toJS());

  return (
    <div>
      <ActionButtons diff={diff} />
      <ConfigList fileConfig={fileConfig} databaseConfig={databaseConfig} isLoading={isLoading} diff={diff} />
    </div>
  );
}
 
export default ConfigPage;