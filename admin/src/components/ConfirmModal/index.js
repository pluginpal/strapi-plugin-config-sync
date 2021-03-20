import React from 'react';
import {
  ModalConfirm,
} from 'strapi-helper-plugin';

import getTrad from '../../helpers/getTrad';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
  return (
    <ModalConfirm
      confirmButtonLabel={{
        id: getTrad(`popUpWarning.button.${type}`),
      }}
      isOpen={isOpen}
      toggle={onClose}
      onClosed={onClose}
      onConfirm={() => {
        onClose();
        onSubmit();
      }}
      type="success"
      content={{
        id: getTrad(`popUpWarning.warning.${type}`),
        values: {
          br: () => <br />,
        },
      }}
    >
      <div>Zeker?</div>
    </ModalConfirm>
  );
}
 
export default ConfirmModal;