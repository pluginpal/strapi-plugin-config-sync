import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { NoContent, useNotification } from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system';

import { exportAllConfig } from '../../state/actions/Config';
import ConfirmModal from '../ConfirmModal';

const FirstExport = () => {
  const toggleNotification = useNotification();
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <div>
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        type="export"
        onSubmit={() => dispatch(exportAllConfig([], toggleNotification))}
      />
      <NoContent
        content={{
          id: 'emptyState',
          defaultMessage:
          formatMessage({ id: 'config-sync.FirstExport.Message' }),
        }}
        action={<Button onClick={() => setModalIsOpen(true)}>{formatMessage({ id: 'config-sync.FirstExport.Button' })}</Button>}
      />
    </div>
  );
};

export default FirstExport;
