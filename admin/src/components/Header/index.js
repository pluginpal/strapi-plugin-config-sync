/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { Header } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';

const HeaderComponent = () => {
  const { formatMessage } = useGlobalContext();

  const headerProps = {
    title: {
      label: formatMessage({ id: 'config-sync.Header.Title' }),
    },
    content: formatMessage({ id: 'config-sync.Header.Description' }),
  };
  
  return (
    <Header {...headerProps} />
  );
};

export default memo(HeaderComponent);
