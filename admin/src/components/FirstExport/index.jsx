import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { getFetchClient, useNotification } from '@strapi/strapi/admin';
import { Button, EmptyStateLayout } from '@strapi/design-system';
import { EmptyDocuments } from '@strapi/icons/symbols';


import { exportAllConfig } from '../../state/actions/Config';
import ConfirmModal from '../ConfirmModal';

const FirstExport = () => {
  const { post, get } = getFetchClient();
  const { toggleNotification } = useNotification();
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <div>
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        type="export"
        onSubmit={() => dispatch(exportAllConfig([], toggleNotification, formatMessage, post, get))}
      />
      <EmptyStateLayout
        content={formatMessage({ id: 'config-sync.FirstExport.Message' })}
        action={<Button onClick={() => setModalIsOpen(true)}>{formatMessage({ id: 'config-sync.FirstExport.Button' })}</Button>}
        icon={<EmptyDocuments width={160} />}
      />
    </div>
  );
};

export default FirstExport;
