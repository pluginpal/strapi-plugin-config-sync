/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import { Layouts } from '@strapi/admin/strapi-admin';
import { Box } from '@strapi/design-system';

const HeaderComponent = () => {
  const { formatMessage } = useIntl();

  return (
    <Box background="neutral100">
      <Layouts.Header
        title={formatMessage({ id: 'config-sync.Header.Title' })}
        subtitle={formatMessage({ id: 'config-sync.Header.Description' })}
      />
    </Box>
  );
};

export default memo(HeaderComponent);
