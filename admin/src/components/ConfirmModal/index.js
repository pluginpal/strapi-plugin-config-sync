import React from 'react';

import { Dialog, DialogBody, DialogFooter } from '@strapi/parts/Dialog';
import { Row } from '@strapi/parts/Row';
import { Text } from '@strapi/parts/Text';
import { Stack } from '@strapi/parts/Stack';
import { Button } from '@strapi/parts/Button';
import DeleteIcon from '@strapi/icons/DeleteIcon';
import AlertWarningIcon from '@strapi/icons/AlertWarningIcon';

import getTrad from '../../helpers/getTrad';

const ConfirmModal = ({ isOpen, onClose, onSubmit, type }) => {
  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      title="Confirmation"
      isOpen={isOpen}
    >
      <DialogBody icon={<AlertWarningIcon />}>
        <Stack size={2}>
          <Row justifyContent="center">
            <Text id="confirm-description">{getTrad(`popUpWarning.warning.${type}`)}</Text>
          </Row>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={(
          <Button
            onClick={() => {
              onClose();
              onSubmit();
            }}
            variant="tertiary"
          >
            Cancel
          </Button>
        )}
        endAction={(
          <Button variant="danger-light" startIcon={<DeleteIcon />}>
            {getTrad(`popUpWarning.button.${type}`)}
          </Button>
        )} />
    </Dialog>
  );
};

export default ConfirmModal;
