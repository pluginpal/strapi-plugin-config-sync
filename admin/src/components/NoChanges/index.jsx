import React from 'react';
import { EmptyStateLayout } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { EmptyDocuments } from '@strapi/icons/symbols';

const NoChanges = () => {
  const { formatMessage } = useIntl();
  return (
    <EmptyStateLayout
      content={formatMessage({ id: 'config-sync.NoChanges.Message', defaultMessage: 'No differences between DB and sync directory. You are up-to-date!' })}
      icon={<EmptyDocuments width={160} />}
    />
  );
};

export default NoChanges;
