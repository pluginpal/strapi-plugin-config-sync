import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { Box } from '@strapi/design-system/Box';
import { useNotification } from '@strapi/helper-plugin';

import { getAllConfigDiff } from '../../state/actions/Config';
import ConfigList from '../../components/ConfigList';
import ActionButtons from '../../components/ActionButtons';

const ConfigPage = () => {
  const toggleNotification = useNotification();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.getIn(['config', 'isLoading'], Map({})));
  const configDiff = useSelector((state) => state.getIn(['config', 'configDiff'], Map({})));

  useEffect(() => {
    dispatch(getAllConfigDiff(toggleNotification));
  }, []);

  return (
    <Box paddingLeft={8} paddingRight={8}>
      <ActionButtons />
      <ConfigList isLoading={isLoading} diff={configDiff.toJS()} />
    </Box>
  );
};

export default ConfigPage;
