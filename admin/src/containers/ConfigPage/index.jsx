import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import {
  Box,
  Alert,
  Typography,
} from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import { getFetchClient, Layouts } from '@strapi/admin/strapi-admin';
import { useIntl } from 'react-intl';

import { getAllConfigDiff, getAppEnv } from '../../state/actions/Config';
import ConfigList from '../../components/ConfigList';
import ActionButtons from '../../components/ActionButtons';

const ConfigPage = () => {
  const { toggleNotification } = useNotification();
  const { get } = getFetchClient();
  const { formatMessage } = useIntl();

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.getIn(['config', 'isLoading'], Map({})));
  const configDiff = useSelector((state) => state.getIn(['config', 'configDiff'], Map({})));
  const appEnv = useSelector((state) => state.getIn(['config', 'appEnv', 'env']));

  useEffect(() => {
    dispatch(getAllConfigDiff(toggleNotification, formatMessage, get));
    dispatch(getAppEnv(toggleNotification, formatMessage, get));
  }, []);

  return (
    <Layouts.Content paddingBottom={8}>
      {appEnv === 'production' && (
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
    </Layouts.Content>
  );
};

export default ConfigPage;
