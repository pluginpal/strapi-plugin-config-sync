import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';

import { getAllConfigDiff } from '../../state/actions/Config';
import ConfigList from '../../components/ConfigList';
import ActionButtons from '../../components/ActionButtons';

const ConfigPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.getIn(['config', 'isLoading'], Map({})));
  const configDiff = useSelector((state) => state.getIn(['config', 'configDiff'], Map({})));

  useEffect(() => {
    dispatch(getAllConfigDiff());
  }, []);

  return (
    <div>
      <ActionButtons diff={configDiff.toJS()} />
      <ConfigList isLoading={isLoading} diff={configDiff.toJS()} />
    </div>
  );
}
 
export default ConfigPage;