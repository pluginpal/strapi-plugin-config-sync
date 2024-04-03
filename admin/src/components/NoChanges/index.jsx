import React from 'react';
import { EmptyStateLayout } from '@strapi/design-system';
import { useIntl } from 'react-intl';

const NoChanges = () => {
  const { formatMessage } = useIntl();
  return (
    <EmptyStateLayout
      content={{
        id: 'emptyState',
        defaultMessage:
          formatMessage({ id: 'config-sync.NoChanges.Message' }),
      }}
    />
  );
};

export default NoChanges;
