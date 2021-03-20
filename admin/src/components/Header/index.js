/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { Header } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';

const HeaderComponent = (props) => {
  const globalContext = useGlobalContext();

  return (
    <Header
      title={{ label: 'Config Sync' }}
      content="Manage your database config across environments."
    />
  );
};

export default memo(HeaderComponent);
