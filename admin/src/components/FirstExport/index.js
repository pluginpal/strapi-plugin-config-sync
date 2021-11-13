import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NoContent } from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system/Button';

import { exportAllConfig } from '../../state/actions/Config';
import ConfirmModal from '../ConfirmModal';

const FirstExport = () => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <ConfirmModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        type="export"
        onSubmit={() => dispatch(exportAllConfig())}
      />
      <NoContent
        content={{
          id: 'emptyState',
          defaultMessage:
            'Looks like this is your first time using config-sync for this project.',
        }}
        action={<Button onClick={() => setModalIsOpen(true)}>Make the initial export</Button>}
      />
    </div>
  );
};

export default FirstExport;
