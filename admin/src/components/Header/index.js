/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import { HeaderLayout } from '@strapi/parts/Layout';
import { Box } from '@strapi/parts/Box';

const HeaderComponent = () => {
  const { formatMessage } = useIntl();

  return (
    <Box background="neutral100">
      <HeaderLayout
        title={formatMessage({ id: 'config-sync.Header.Title' })}
        subtitle={formatMessage({ id: 'config-sync.Header.Description' })}
        as="h2"
      />
    </Box>
  );
};

export default memo(HeaderComponent);
