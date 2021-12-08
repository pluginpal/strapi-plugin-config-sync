import React from 'react';
import { NoContent } from '@strapi/helper-plugin';

const NoChanges = () => (
  <NoContent
    content={{
      id: 'emptyState',
      defaultMessage:
        'No differences between DB and sync directory. You are up-to-date!',
    }}
  />
);

export default NoChanges;
