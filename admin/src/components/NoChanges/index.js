import React from 'react';
import { NoContent } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';

const NoChanges = () => {
  const { formatMessage } = useIntl();
  return (
    <NoContent
      content={{
        id: 'emptyState',
        defaultMessage:
          formatMessage({ id: 'config-sync.NoChanges.Message' }),
      }}
    />
  );
};

export default NoChanges;
