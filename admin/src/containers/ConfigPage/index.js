import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { Box } from '@strapi/design-system/Box';
import { useNotification } from '@strapi/helper-plugin';
import { Alert } from '@strapi/design-system/Alert';
import { Typography } from '@strapi/design-system/Typography';

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
    <Box paddingLeft={8} paddingRight={8} paddingBottom={8}>
      {process.env.NODE_ENV === 'production' && (
        <Box paddingBottom={4}>
          <Alert variant="danger">
            <Typography variant="omega" fontWeight="bold">You&apos;re in the production environment</Typography><br />
            Please be careful when syncing your config in production.<br />
            Make sure you are not overriding critical config changes on import.
          </Alert>
        </Box>
      )}
      <ActionButtons />
      <ConfigList isLoading={isLoading} diff={configDiff.toJS()} />
    </Box>
  );
};

export default ConfigPage;
